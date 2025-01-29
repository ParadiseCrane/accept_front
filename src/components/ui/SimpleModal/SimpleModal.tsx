import { pureCallback } from '@custom-types/ui/atomic';
import { IDropdownContent } from '@custom-types/ui/basics/helper';
import { ModalProps } from '@mantine/core';
import modalStyles from '@styles/ui/modal.module.css';
import { Helper } from '@ui/basics';
import dynamic from 'next/dynamic';
import { FC, memo } from 'react';

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
    <DynamicModal
      transitionProps={{
        transition: 'fade',
        duration: 450,
        timingFunction: 'ease',
      }}
      withCloseButton={!hideCloseButton}
      title={
        <div className={modalStyles.titleWrapper}>
          <div className={modalStyles.title}>{title}</div>
          {helperContent && <Helper dropdownContent={helperContent} />}
        </div>
      }
      onClose={close}
      {...props}
    >
      {children}
    </DynamicModal>
  );
};

export default memo(SimpleModal);
