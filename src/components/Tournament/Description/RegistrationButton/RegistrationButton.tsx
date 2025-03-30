import { pureCallback } from '@custom-types/ui/atomic';
import { FC, memo } from 'react';

import CancelRegistration from './CancelRegistration/CancelRegistration';
import Register from './Register/Register';

const RegistrationButton: FC<{
  spec: string;
  status: number;
  allowRegistrationAfterStart: boolean;
  registered: boolean;
  onRegistration: pureCallback;
  onRefusal: pureCallback;
  withPin: boolean;
  maxTeamSize: number;
}> = ({
  spec,
  status,
  allowRegistrationAfterStart,
  registered,
  onRegistration,
  onRefusal,
  withPin,
  maxTeamSize,
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
              allowRegistrationAfterStart={allowRegistrationAfterStart}
              onRegistration={onRegistration}
              withPin={withPin}
              maxTeamSize={maxTeamSize}
            />
          )
        )}
      </div>
    </>
  );
};

export default memo(RegistrationButton);
