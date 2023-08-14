import { pureCallback } from '@custom-types/ui/atomic';
import { FC, memo } from 'react';
import modalStyles from '@styles/ui/modal.module.css';
import { Helper } from '@ui/basics';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import dynamic from 'next/dynamic';
import { ModalProps } from '@mantine/core';

const DynamicModal = dynamic<ModalProps>(() =>
  import('@mantine/core').then((res) => res.Modal)
);

interface SimpleModalProps extends Omit<ModalProps, 'onClose'> {
  helperContent?: IDropdownContent;
  close?: pureCallback<void>;
  hideCloseButton?: boolean;
}

const SimpleModal: FC<SimpleModalProps> = ({
  title,
  helperContent,
  close = () => {},
  children,
  hideCloseButton,
  ...props
}) => {
  return (
    <div>
      <DynamicModal
        transitionProps={{
          transition: 'fade',
          duration: 450,
          timingFunction: 'ease',
        }}
        withCloseButton={!!!hideCloseButton}
        title={
          <div className={modalStyles.titleWrapper}>
            <div className={modalStyles.title}>{title}</div>
            {helperContent && (
              <Helper dropdownContent={helperContent} />
            )}
          </div>
        }
        zIndex={200}
        onClose={close}
        {...props}
      >
        {children}
      </DynamicModal>
    </div>
  );
};

export default memo(SimpleModal);
