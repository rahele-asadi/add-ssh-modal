import Button from 'components/common/form/button';
import { useTranslate } from 'services/translate';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

// ********************************************************************
interface KeyPairsStatusProps {
  error: string;
  loading: boolean;
  isEmpty: boolean;
  onRetry: () => void;
}

const KeyPairsStatus: React.FC<KeyPairsStatusProps> = ({
  error,
  loading,
  isEmpty,
  onRetry,
}) => {
  const strings = useTranslate('dashboard.createInstance.addKey.status');

  return (
    <Grid container alignItems='center' className='mt-20 text-dark-primary'>
      {loading && <CircularProgress size={18} className='text-primary' thickness={2} />}
      {loading ? (
        <span className='mx-10'>{strings.loadingSSH}</span>
      ) : error ? (
        <span className='text-danger'>
          {strings.errorSSH}&nbsp;
          <Button
            label={strings.tryAgain}
            variant='text'
            color='primary'
            onClick={onRetry}
          />
        </span>
      ) : (
        isEmpty && <span className='text-info'>{strings.emptySSH}</span>
      )}
    </Grid>
  );
};

export default KeyPairsStatus;
