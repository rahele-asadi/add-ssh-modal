// React.js
import React, { useState, memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

//  Material Ui
import Grid from '@material-ui/core/Grid';

// Components
import P from 'components/common/paragraph';
import Icon from 'components/common/icons';
import Button from 'components/common/form/button';
import ServerError from 'components/server-error';
import Modal from 'components/common/modal';
import TextInput from 'components/common/form/controllers/text-input';

import { useTranslate } from 'services/translate';
import { useCreateInstanceContext } from 'store/instance-context/create';

// *******************************************************************
interface CreateSSHKeyProps {
  setKeyPairCreated: Function;
  openModal: boolean;
  setOpenModal: Function;
}

const CreateSSHKey: React.FC<CreateSSHKeyProps> = ({
  setKeyPairCreated,
  openModal,
  setOpenModal,
}) => {
  const strings = useTranslate('dashboard.createInstance.addKey.create');
  const { setSSHKeyName, addKeyPair } = useCreateInstanceContext();
  const { getValues, setValue } = useFormContext();

  const [generatedSSH, setGeneratedSSH] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<any>(null);

  const handleCloseDialog = () => {
    setValue('sshKeyName', '');
    setValue('sshKey', '');
    setGeneratedSSH(null);
    setLoading(false);
    setOpenModal(false);
  };

  const downloadSSHKey = (ssh) => {
    if (typeof window !== 'undefined' && document && ssh) {
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        `data:text/plain;charset=utf-8,${encodeURIComponent(ssh.private_key)}`,
      );
      element.setAttribute('download', `${ssh.name}-privateKey.pem`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleCreateKeyPair = async () => {
    if (generatedSSH) handleCloseDialog();
    if (loading) return;

    setLoading(true);
    setApiError(null);

    const sshKeyName = getValues('sshKeyName');
    const sshKey = getValues('sshKey');
    const SSHKeyFormIsValid = sshKeyName !== '' && sshKey !== '';

    if (SSHKeyFormIsValid) {
      const res = await addKeyPair(sshKeyName, sshKey);
      if (!res.hasError) {
        setKeyPairCreated(true);
        setSSHKeyName(res.data?.data.name);
        handleCloseDialog();
      } else {
        setApiError(res.errors);
        setLoading(false);
      }
    }
  };

  const handleGenerateKeyPair = async () => {
    const sshKeyName = getValues('sshKeyName');
    if (loading) return;

    setLoading(true);
    setApiError(null);

    if (!!sshKeyName) {
      const res = await addKeyPair(sshKeyName);
      if (!res.hasError) {
        let data = res.data?.data;
        setKeyPairCreated(true);
        setSSHKeyName(data?.name);
        setGeneratedSSH(data);
        downloadSSHKey(data);
        handleCloseDialog();
      } else {
        setApiError(res.errors);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    openModal && setKeyPairCreated(false);
  }, [openModal]);

  return (
    <Modal
      maxWidth='sm'
      open={openModal}
      onClose={handleCloseDialog}
      PaperClassName='create-instance'
    >
      <Grid item xs={12} className='add-ssh'>
        <P className='text-secondary mb-30'>{strings.modalDescription}</P>
        <Grid item xs={12}>
          <TextInput
            name='sshKeyName'
            borderType='outlined'
            label={strings.name}
            required={true}
            placeholder={strings.nameSelectionIsRequired}
            minLength={3}
            defaultValue={generatedSSH ? generatedSSH.name : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            name='sshKey'
            borderType='simple'
            required={true}
            placeholder={strings.sshKeyText}
            defaultValue={generatedSSH ? generatedSSH.public_key : ''}
            inputProps={{
              multiline: true,
              rows: 7,
              style: { height: 'auto' },
            }}
          />
        </Grid>

        {!!apiError && (
          <Grid item xs={12}>
            <ServerError errors={apiError} className='my-10' />
          </Grid>
        )}

        <Grid container justifyContent='space-between' className='mt-30'>
          <Grid item xs={12} sm={4}>
            <Button
              variant='outlined'
              color='primary'
              borderType='default'
              fullWidth={true}
              label={strings.generate}
              onClick={handleGenerateKeyPair}
              iconComponent={<Icon name='key' className='key-icon' />}
            />
          </Grid>
          <Grid item container xs={12} sm={4} spacing={1}>
            <Grid item xs={12} sm={6}>
              <Button
                borderType='default'
                variant='outlined'
                fullWidth={true}
                color='primary'
                label={strings.cancel}
                onClick={handleCloseDialog}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                borderType='default'
                color='primary'
                fullWidth={true}
                disabled={loading}
                label={strings.ok}
                loading={loading}
                loadingColor='text-primary'
                onClick={handleCreateKeyPair}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default memo(CreateSSHKey);
