import { IDropdownContent } from '@custom-types/ui/basics/helper';
import inputStyles from '@styles/ui/input.module.css';
import { FC, ReactNode, memo } from 'react';

import Helper from '../Helper/Helper';

const InputLabel: FC<{
  label?: ReactNode;
  helperContent?: IDropdownContent;
  required?: boolean;
}> = ({ label, helperContent, required }) => {
  return (
    <>
      {(label || helperContent) && (
        <div className={inputStyles.labelWrapper}>
          <div className={inputStyles.label}>
            {label}
            {required && <div className={inputStyles.labelRequired}>*</div>}
          </div>
          {helperContent && <Helper dropdownContent={helperContent} />}
        </div>
      )}
    </>
  );
};

export default memo(InputLabel);
