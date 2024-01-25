import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

const SaveButton = ({ onClick, text, isLoading, isDisabled }) => {
  const [t] = useTranslation();

  return (
    <Button type="primary" shape="round" size={'middle'} disabled={isDisabled} loading={isLoading} onClick={onClick}>
      {text || t('primary.buttons.save')}
    </Button>
  );
};

export default SaveButton;
