import { useState } from 'react';

import Grid from '@material-ui/core/Grid';

import Button from 'components/common/form/button';
import Modal from 'components/common/modal';
import ServerError from 'components/server-error';
import Heading from 'components/common/heading';
import P from 'components/common/paragraph';

import { useTranslate } from 'services/translate';
import { useCreateInstanceContext } from 'store/instance-context/create';

// ***************************************************************************

const RemoveKeypair = ({ name, setOpenModal }) => {
  const strings = useTranslate('dashboard.createInstance.addKey.remove');
  const { removeKeyPair, getKeyPairs } = useCreateInstanceContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<any>(null);

  const handleCloseModal = () => setOpenModal(null);

  const handleRemoveKeyPair = async () => {
    if (loading) return;

    setLoading(true);
    setApiError(null);

    const res: any = await removeKeyPair(name);
    if (!res.hasError) await getKeyPairs();
    else setApiError(res.errors);

    setLoading(false);
  };

  return (
    <Modal open fullWidth maxWidth='xs' onClose={handleCloseModal}>
      <Grid container>
        <Grid item xs={12}>
          <Heading variant='h2' className='pt-0'>
            {strings.removeKeypair}
          </Heading>
        </Grid>
        <Grid item xs={12} className='mt-20'>
          <P>{strings.removeKeypairText.replace('$', name)}</P>
        </Grid>

        {!!apiError && (
          <Grid item xs={12}>
            <ServerError errors={apiError} className='mt-15' />
          </Grid>
        )}

        <Grid item container justify='center' className='mt-40 mb-0' xs={12}>
          <Button
            label={strings.remove}
            loading={loading}
            loadingSize={20}
            color='danger'
            borderType='default'
            fullWidth={true}
            onClick={handleRemoveKeyPair}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default RemoveKeypair;
