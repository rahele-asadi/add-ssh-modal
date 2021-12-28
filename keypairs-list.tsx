import React, { useState } from 'react';
import { useCreateInstanceContext } from 'store/instance-context/create';

import dynamic from 'next/dynamic';

import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Icon from 'components/common/icons';
import KeyPairsStatus from './keypairs-status';
const RemoveKeypairModal = dynamic(() => import('./remove-keypair'));

//***********************************************************************

interface KeyPairsListProps {
  handleRetry: () => void;
}

const KeyPairsList: React.FC<KeyPairsListProps> = ({ handleRetry }) => {
  const {
    setSSHKeyName,
    SSHKeyName,
    keyPairs,
    keyPairs: {
      status: { errors, loading },
    },
  } = useCreateInstanceContext();

  const isEmpty = keyPairs.data?.length === 0;
  const [currentRemoveModal, setCurrentRemoveModal] = useState<string | null>(null);

  const handleOpenCurrentRemoveModal = (name) => () => setCurrentRemoveModal(name);

  const handleChangeKeyPair = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSSHKeyName(e.target.value);
  };

  const SSHRadio = (
    <Radio className='keypair-icon' classes={{ checked: 'keypair-icon-checked' }} />
  );

  const ShowKeyPairs = (
    <RadioGroup
      row
      aria-label='KeyPairs'
      name='keyparis'
      className='keypairs-radioGroup mt-20'
      value={SSHKeyName}
      onChange={handleChangeKeyPair}
    >
      {keyPairs.data?.map(({ name }) => (
        <Grid
          container
          item
          xs={12}
          key={name}
          justifyContent='space-between'
          alignItems='center'
          className='radio-box'
        >
          <Grid item>
            <FormControlLabel
              key={name}
              label={name}
              value={name}
              control={SSHRadio}
              classes={{ root: 'keypair-radio', label: 'keypair-label' }}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={handleOpenCurrentRemoveModal(name)}>
              <Icon name='remove' className='remove-icon' />
            </IconButton>
          </Grid>
          {currentRemoveModal === name && (
            <RemoveKeypairModal name={name} setOpenModal={setCurrentRemoveModal} />
          )}
        </Grid>
      ))}
    </RadioGroup>
  );

  return loading || errors || isEmpty ? (
    <KeyPairsStatus
      error={errors}
      loading={loading}
      isEmpty={isEmpty}
      onRetry={handleRetry}
    />
  ) : (
    <>{ShowKeyPairs}</>
  );
};

export default KeyPairsList;
