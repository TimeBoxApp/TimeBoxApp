import * as Yup from 'yup';
import YupPassword from 'yup-password';
import to from 'await-to-js';
import { useEffect } from 'react';
import { Checkbox, Form } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import InputField from '../../components/Primary/InputField/InputField';
import Button from '../../components/Primary/Button/Button';
import { signUp } from './services/user';
import { error } from '../../services/notification';
import { NAME_REGEX } from '../../services/regex';
import { success } from '../../services/alerts';
import { useCurrentUser } from '../../services/store/useCurrentUserStore';

import styles from './signup.module.scss';

YupPassword(Yup);

const Signup = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [t] = useTranslation();

  useEffect(() => {
    if (currentUser.id) navigate('/board');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const handleSignup = async (values) => {
    const { firstName, lastName, email, password } = values;

    const [err, res] = await to(
      signUp({
        firstName,
        lastName,
        email,
        password
      })
    );

    if (err) return error(err.message);

    if (res.statusCode === 201) {
      success(t('signup.success', { email }));

      return navigate(`/login`, { replace: true });
    }
  };

  return (
    <div className={styles.background}>
      <Helmet>
        <title>{t('primary.helmet.signup')}</title>
      </Helmet>
      <div className={styles.content}>
        <div className={styles.textDescription}>
          <h1 className={styles.title}>{t('primary.name')}</h1>
          <h2 className={styles.line}>{t('primary.line')}</h2>
        </div>
        <div className={styles.form}>
          <div className={styles.formContainer}>
            <div className={styles.textContent}>
              <h2>{t('signup.signUp')}</h2>
              <h4 className={styles.description}>{t('signup.description')}</h4>
            </div>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                acceptPolicy: false
              }}
              validationSchema={Yup.object({
                firstName: Yup.string()
                  .matches(NAME_REGEX, t('primary.validation.invalidFirstName'))
                  .required(t('primary.validation.required')),
                lastName: Yup.string()
                  .matches(NAME_REGEX, t('primary.validation.invalidLastName'))
                  .required(t('primary.validation.required')),
                email: Yup.string()
                  .email(t('primary.validation.invalidEmail'))
                  .required(t('primary.validation.required')),
                password: Yup.string()
                  .min(8, t('primary.validation.passwordMinCharacters'))
                  .minLowercase(1, t('primary.validation.passwordMinLowercase'))
                  .minUppercase(1, t('primary.validation.passwordMinUppercase'))
                  .minNumbers(1, t('primary.validation.passwordMinNumbers'))
                  .minSymbols(1, t('primary.validation.passwordMinSymbols'))
                  .required(t('primary.validation.required')),
                acceptPolicy: Yup.bool().oneOf([true])
              })}
              onSubmit={(values) => handleSignup(values)}
            >
              {({ setFieldValue, isValid, isSubmitting, submitForm, values }) => (
                <Form className={styles.textInputContainers}>
                  <div className={styles.nameFields}>
                    <InputField
                      label={t('primary.userFields.firstName')}
                      name="firstName"
                      type="text"
                      placeholder={t('signup.placeholders.firstName')}
                      required
                    />
                    <InputField
                      label={t('primary.userFields.lastName')}
                      name="lastName"
                      type="text"
                      placeholder={t('signup.placeholders.lastName')}
                      required
                    />
                  </div>
                  <InputField
                    label={t('primary.userFields.email')}
                    name="email"
                    type="email"
                    placeholder={t('signup.placeholders.email')}
                    required
                  />
                  <InputField
                    label={t('primary.userFields.password')}
                    name="password"
                    type="password"
                    placeholder={t('signup.placeholders.password')}
                    required
                  />
                  <div className={styles.additionalSettings}>
                    <Checkbox
                      name={'acceptPolicy'}
                      checked={values.acceptPolicy}
                      onChange={(e) => setFieldValue('acceptPolicy', e.target.checked)}
                    >
                      <Trans
                        i18nKey="signup.policy"
                        components={[
                          <a target="_blank" rel="noopener noreferrer" href="https://openai.com/terms/">
                            &nbsp;Terms of Use&nbsp;
                          </a>,
                          <a target="_blank" rel="noopener noreferrer" href="https://openai.com/terms/">
                            &nbsp;Privacy Policy&nbsp;
                          </a>
                        ]}
                      />
                    </Checkbox>
                  </div>
                  <Button
                    type="submit"
                    text={t('signup.signUp')}
                    onClick={submitForm}
                    isLoading={isSubmitting}
                    disabled={!isValid || isSubmitting}
                  />
                </Form>
              )}
            </Formik>
            <span className={styles.linkToRegister}>
              {t('signup.alreadyMember')}
              <Link to="/login">{t('signup.signIn')}</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
