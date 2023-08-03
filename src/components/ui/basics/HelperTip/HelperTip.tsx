import { Help } from 'tabler-icons-react';
import { FC, memo } from 'react';
import { Icon, Tip } from '@ui/basics';
import { MyHelperTipProps } from '@custom-types/ui/basics/helper';

const HelperTip: FC<MyHelperTipProps> = ({
  customIcon,
  iconColor,
  size,
  ...props
}) => {
  return (
    <Tip {...props}>
      <Icon size={size || 'xs'}>
        {customIcon || <Help color={iconColor || 'var(--dark4)'} />}
      </Icon>
    </Tip>
  );
};

export default memo(HelperTip);
