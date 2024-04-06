import * as Yup from 'yup';
import to from 'await-to-js';
import { useEffect } from 'react';
import { Checkbox, Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import InputField from '../../components/Primary/InputField/InputField';
import Button from '../../components/Primary/Button/Button';
import { login } from './services/auth';
import { error } from '../../services/notification';
import { success } from '../../services/alerts';
import { useCurrentUser, useCurrentUserActions } from '../../services/store/useCurrentUserStore';

import styles from './login.module.scss';

const Login = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const { updateCurrentUser } = useCurrentUserActions();
  const [t] = useTranslation();

  useEffect(() => {
    if (currentUser.id) navigate('/board');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const handleLogin = async (values) => {
    const { email, password } = values;
    const [err, res] = await to(
      login({
        email,
        password
      })
    );

    if (err) return error(err.message);

    if (res.statusCode === 200) {
      success(t('login.success', { email }));
      updateCurrentUser(res.userData);

      return navigate('/board');
    }
  };

  return (
    <div className={styles.background}>
      <Helmet>
        <title>{t('primary.helmet.login')}</title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.textDescription}>
          <h1 className={styles.title}>{t('primary.name')}</h1>
          <h2 className={styles.line}>{t('primary.line')}</h2>
        </div>
        <div className={styles.form}>
          <div className={styles.formContainer}>
            <div className={styles.textContent}>
              <h2>{t('login.signIn')}</h2>
              <h4 className={styles.description}>{t('login.description')}</h4>
            </div>
            <Formik
              initialValues={{
                email: '',
                password: ''
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email(t('primary.validation.invalidEmail'))
                  .required(t('primary.validation.required')),
                password: Yup.string().required(t('primary.validation.required'))
              })}
              onSubmit={(values) => handleLogin(values)}
            >
              {({ isValid, isSubmitting, submitForm }) => (
                <Form className={styles.textInputContainers}>
                  <InputField
                    label={t('primary.userFields.email')}
                    name="email"
                    type="email"
                    placeholder={t('login.placeholders.email')}
                    required
                  />
                  <InputField
                    label={t('primary.userFields.password')}
                    name="password"
                    type="password"
                    placeholder={t('login.placeholders.password')}
                    required
                  />
                  <div className={styles.additionalSettings}>
                    <Checkbox onChange={() => {}}>{t('login.keepLoggedIn')}</Checkbox>
                    <Link to={'login'}>{t('login.forgotPassword')}</Link>
                  </div>
                  <Button
                    type="submit"
                    text={t('login.signIn')}
                    onClick={submitForm}
                    isLoading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                  />
                </Form>
              )}
            </Formik>
            <span className={styles.linkToRegister}>
              {t('login.signUp')}
              <Link to="/signup">{t('login.createAccount')}</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
