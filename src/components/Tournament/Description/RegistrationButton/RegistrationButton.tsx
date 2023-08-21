import { pureCallback } from '@custom-types/ui/atomic';
import { FC, memo } from 'react';

import CancelRegistration from './CancelRegistration/CancelRegistration';
import Register from './Register/Register';

const RegistrationButton: FC<{
  spec: string;
  status: number;
  allowRegistrationAfterStart: boolean;
  registered: boolean;
  onRegister: pureCallback;
  onRefusal: pureCallback;
  withPin?: boolean;
}> = ({
  spec,
  status,
  allowRegistrationAfterStart,
  registered,
  onRegister,
  onRefusal,
  withPin,
}) => {
  return (
    <>
      <div>
        {registered ? (
          <CancelRegistration
            spec={spec}
            status={status}
            allowRegistrationAfterStart={allowRegistrationAfterStart}
            onRefusal={onRefusal}
          />
        ) : (
          (status === 0 || allowRegistrationAfterStart) && (
            <Register
              spec={spec}
              allowRegistrationAfterStart={
                allowRegistrationAfterStart
              }
              onRegister={onRegister}
              withPin={withPin}
            />
          )
        )}
      </div>
    </>
  );
};

export default memo(RegistrationButton);
