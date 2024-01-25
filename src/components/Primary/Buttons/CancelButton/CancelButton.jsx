import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

const CancelButton = ({ onClick, text, isLoading }) => {
  const [t] = useTranslation();

  return (
    <Button type="text" shape="round" size={'middle'} loading={isLoading} onClick={onClick}>
      {text || t('primary.buttons.cancel')}
    </Button>
  );
};

export default CancelButton;
