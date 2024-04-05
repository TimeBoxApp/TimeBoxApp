import { Button } from 'antd';

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <Button shape={'round'} type={'primary'} size={'small'} onClick={goToToday}>
          Today
        </Button>
      </span>
      <span className="rbc-btn-group">
        <Button shape={'round'} size={'small'} onClick={goToBack}>
          Previous
        </Button>
        <Button shape={'round'} size={'small'} onClick={goToNext}>
          Next
        </Button>
      </span>
      <span className="rbc-toolbar-label">
        <b>{toolbar.label}</b>
      </span>
    </div>
  );
};

export default CustomToolbar;
