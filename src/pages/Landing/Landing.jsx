import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

import styles from './landing.module.scss';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>👋🏻 Hello</h2>
      <p>
        You have access to Timebox – a platform we built in the scope of my bachelor thesis to address the issues with
        task tracking and time management. Despite it's in the development stage, I still sincerely invite you to test
        it and write your impressions. Have fun!
      </p>
      <Button type={'primary'} onClick={() => navigate('/login')}>
        Go to the Login page
      </Button>
    </div>
  );
};

export default Landing;
