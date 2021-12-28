// React.js
import React, { useState, memo, useEffect } from 'react';

// Next.js
import dynamic from 'next/dynamic';

//  Material Ui
import Grid from '@material-ui/core/Grid';

// Components
const CreateSSHKey = dynamic(() => import('./create-SSHKey'));
const KeyPairsList = dynamic(() => import('./keypairs-list'));
import P from 'components/common/paragraph';
import Button from 'components/common/form/button';
import SectionsBox from 'components/pages/instances/create/sections-box';

import { useTranslate } from 'services/translate';
import { useCreateInstanceContext } from 'store/instance-context/create';

// ******************************************************************

const AddSSHKey: React.FC = () => {
  const strings = useTranslate('dashboard.createInstance.addKey.main');
  const { getKeyPairs } = useCreateInstanceContext();

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [keyPairCreated, setKeyPairCreated] = useState<boolean>(false);
  const [showKeyPairs, setShowKeyPairs] = useState<boolean>(false);

  useEffect(() => {
    keyPairCreated && getKeyPairs();
  }, [keyPairCreated]);

  useEffect(() => {
    getKeyPairs();
  }, []);

  const handleRetry = () => getKeyPairs();

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleShowKeyPairs = () => setShowKeyPairs(true);

  return (
    <SectionsBox title={strings.addKeyTitle} className='add-ssh'>
      <Grid container alignItems='center' justifyContent='space-between'>
        <Grid item>
          <P className='text-secondary'>{strings.description}</P>
        </Grid>
        <Grid item>
          <Button
            label={strings.addNewKey}
            borderType='default'
            color='primary'
            onClick={handleOpenCreateModal}
          />
        </Grid>
      </Grid>
      <Grid container className='mt-10'>
        <Button
          color='primary'
          label={strings.showKeysList}
          borderType='default'
          variant='text'
          onClick={handleShowKeyPairs}
          icon={{
            type: 'mui',
            name: 'expand_more',
          }}
        />
      </Grid>
      {!!openCreateModal && (
        <CreateSSHKey
          setKeyPairCreated={setKeyPairCreated}
          openModal={openCreateModal}
          setOpenModal={setOpenCreateModal}
        />
      )}
      {!!showKeyPairs && <KeyPairsList handleRetry={handleRetry} />}
    </SectionsBox>
  );
};

export default memo(AddSSHKey);
