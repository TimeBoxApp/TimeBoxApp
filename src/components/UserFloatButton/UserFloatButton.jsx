import { cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Divider, Dropdown, Modal, Space, theme } from 'antd';

import { userStore } from '../../services/store/userStore';
import { logout } from '../../pages/Login/services/auth';
import { clearUser } from '../../services/user';

import styles from './user-float-button.module.scss';

import { ExclamationCircleFilled, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { ReactComponent as BellIcon } from './images/bell.inline.svg';
import { ReactComponent as BoardIcon } from './images/board.inline.svg';

const { useToken } = theme;
const { confirm } = Modal;

const UserFloatButton = () => {
  const { user } = userStore();
  const [t] = useTranslation();
  const navigate = useNavigate();

  /**
   * Proceed user logout
   */
  async function proceedLogout() {
    await logout();
    navigate('/login');

    return clearUser();
  }

  const showLogoutConfirm = () => {
    confirm({
      title: t('primary.floatButton.logoutTitle'),
      icon: <ExclamationCircleFilled />,
      async onOk() {
        await proceedLogout();
      }
    });
  };
  const items = [
    {
      label: t('primary.floatButton.profileSettings'),
      key: '1',
      icon: <UserOutlined />,
      onClick: () => navigate('/settings')
    },
    {
      label: t('primary.floatButton.logout'),
      key: '2',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: showLogoutConfirm
    }
  ];
  const { token } = useToken();
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary
  };
  const menuStyle = {
    boxShadow: 'none'
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerButton} onClick={() => navigate('/board')}>
        <BoardIcon />
      </div>
      <BellIcon />
      <Dropdown
        menu={{ items }}
        dropdownRender={(menu) => (
          <div style={contentStyle}>
            <Space
              style={{
                padding: 16,
                fontWeight: 'bold'
              }}
            >
              {t('primary.floatButton.header', { fullName: user.fullName })}
            </Space>
            <Divider
              style={{
                margin: 2
              }}
            />
            {cloneElement(menu, { style: menuStyle })}
          </div>
        )}
      >
        <Avatar
          style={{
            backgroundColor: '#e9edf7',
            color: '#8f9bba',
            cursor: 'pointer'
          }}
        >
          {user?.initials || <UserOutlined />}
        </Avatar>
      </Dropdown>
    </div>
  );
};

export default UserFloatButton;
