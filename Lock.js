import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Howl } from 'howler';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import useMousetrap from 'react-hook-mousetrap';
import Button from '../Common/Button';
import SwitchTheme from '../Common/SwitchTheme';
import Animation, { ANIME_DELAY_PE, ANIME_DURATION } from '../Common/Animation';
import { setAlertModal } from '../../reducers/onboarding';
import logoblue from '../../assets/images/logo-blue.png';
import passwordlock from '../../assets/images/passwordlock.svg';
import keyReactangle from '../../assets/images/key-reactangle.svg';
import './Lock.scss';
import { useNodeWebsocket } from '../../hooks/nodeWebsocket';
import { useDaemonWebsocket } from '../../hooks/daemonWebsocket';
import { setPassword } from '../../reducers/wallet';
import { useTranslation } from 'react-i18next';
import electronStore from 'electron-store';

const unlockHowl = new Howl({
  src: ['assets/sounds/LoginSuccess.webm'],
});

const { ipcRenderer } = window.require('electron');

const Lock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showPwd, setShowPwd] = React.useState(false);
  const [pwdStr, setPwdStr] = React.useState('');
  const [validate, setValidate] = React.useState(null);
  const [transOut, setTransOut] = React.useState(false);
  const [warning, setWarning] = React.useState(false);

  const activeTab = useSelector((state) => state.dashboard.activeTab);

  const {
    store,
    node: { setup: nodeSetup },
    socket: {
      daemon: { isRunning: daemonRunning },
      node: { isRunning: nodeRunning },
    },
  } = useSelector((state) => state.wallet);

  const { startNode, modifySetup } = useDaemonWebsocket();
  const { checkPassword, shutdown } = useNodeWebsocket();

  useMousetrap('enter', () => {
    unlockApp();
  });

  const unlockApp = async () => {
    const neighborhoodMode = nodeSetup['neighborhood-mode'].value;
    if (!pwdStr) {
      setValidate(t('Lock.Password cannot be blank'));
      return;
    }
    if (!daemonRunning) {
      dispatch(
        setAlertModal({
          isOpen: true,
          body: t('Lock.Daemon is not running'),
          description: t(
            'Lock.It seems like the Daemon is not responding Please consult the documentation at docs.masq.ai'
          ),
        })
      );
      return;
    }

    if (nodeRunning && neighborhoodMode != 'zero-hop') {
      const result = await checkPassword(pwdStr);
      if (!result) {
        return;
      }
      const { matches } = result;
      if (!matches) {
        setValidate(t('Lock.Password is Incorrect!'));
        return;
      }
    } else {
      await startNode();
      const result = await checkPassword(pwdStr);
      if (!result) {
        return;
      }
      const { matches } = result;
      if (!matches) {
        setValidate(t('Lock.Password is Incorrect!'));
        return;
      }
      await shutdown();
      const modifySuccess = await modifySetup([
        {
          name: 'db-password',
          value: pwdStr,
        },
      ]);
      if (!modifySuccess) {
        return;
      }
    }
    dispatch(setPassword(pwdStr));
    ipcRenderer.send('select-tab', { tabIndex: activeTab });

    unlockHowl.play();

    const { state } = location;

    if (state) {
      const { redirectURL } = state;

      if (redirectURL) {
        setTransOut(true);
        setTimeout(() => {
          navigate(redirectURL);
        }, 4 * ANIME_DELAY_PE + ANIME_DURATION);
        return;
      }
    }
    setTransOut(true);
    setTimeout(() => {
      navigate(-1);
    });
  };

  const onNeedHint = () => {
    const passwordHint = store.get('password.hint');
    dispatch(
      setAlertModal({
        isOpen: true,
        body: t('Lock.Here is your password hint'),
        description: passwordHint,
        preIcon: keyReactangle,
      })
    );
  };

  return (
    <div className={classNames(['container-fluid', 'lock'])}>
      <div
        className="row justify-content-center"
        style={{ minHeight: '100vh', alignItems: 'center' }}
      >
        <div className="col-5 text-center mt-5 lockTranslate">
          <Animation type="fade" index={0} transOut={transOut}>
            <img src={logoblue} alt="logoblue" className="lock__logo" />
          </Animation>
          <Animation type="slide-down" index={1} transOut={transOut}>
            <h5>{t('Dashboard.THE DECENTRALIZED WEB POWERED BY YOU')}.</h5>
          </Animation>
          <Animation type="slide-right" index={2} transOut={transOut}>
            <div className="d-flex justify-content-between mt-5">
              <label className="d-flex align-items-center lock__label">
                <img src={passwordlock} alt="passwordlock" />
                <h6> {t('Dashboard.TYPE PASSWORD')}</h6>
              </label>
              <label
                onClick={onNeedHint}
                className="lock__label lock__label--hint"
                aria-hidden="true"
              >
                <h6>{t('Dashboard.Needahint')}</h6>
              </label>
            </div>
            <div className="lock__inputBox">
              {showPwd ? (
                <IoIosEyeOff
                  size={20}
                  color="#7DD8FF"
                  onClick={() => setShowPwd(!showPwd)}
                />
              ) : (
                <IoIosEye
                  size={20}
                  color="#7DD8FF"
                  onClick={() => setShowPwd(!showPwd)}
                />
              )}
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                onChange={(e) => {
                  setValidate(null);
                  setPwdStr(e.target.value);
                }}
                onKeyDown={(e) => {
                  let isCapsLockOn = e.getModifierState('CapsLock');
                  if (isCapsLockOn) {
                    setWarning(true);
                  } else {
                    setWarning(false);
                  }
                  if (e.key === 'Enter') {
                    unlockApp();
                  }
                }}
                value={pwdStr}
                className="lock__inputBox__input"
              />
              {validate && (
                <p className="lock__inputBox--validate">{validate}</p>
              )}
              {warning && (
                <p className="lock__inputBox--warning">Caps Lock On!</p>
              )}
            </div>
          </Animation>
          <Animation type="slide-right" transOut={transOut} index={3}>
            <Button className="mt-4" onClick={unlockApp}>
              {t('Dashboard.UNLOCKAPP')}
            </Button>
          </Animation>
        </div>
      </div>
      <Animation transOut={transOut} type="slide-right" index={4}>
        <SwitchTheme />
      </Animation>
    </div>
  );
};

export default Lock;
