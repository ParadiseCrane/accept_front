import { FC, memo } from 'react';
import { Button, Pin, TextInput } from '@ui/basics';
// import styles from './enterPinCode.module.css'

const CreateTeam: FC<{ form: any }> = ({ form }) => {
  return (
    <>
      <Pin
        label={'Пинкод турнира'}
        {...form.getInputProps('pinCode')}
      />
      <TextInput
        label={'Название команды'}
        {...form.getInputProps('teamName')}
      />
      <Button>Создать команду</Button>
    </>
  );
};

export default memo(CreateTeam);
