import {
  FC,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Group, Text } from '@mantine/core';
import { Dropzone as MantineDropzone } from '@mantine/dropzone';
import { AlertCircle, CircleX, FileUpload, Photo } from 'tabler-icons-react';
import { useLocale } from '@hooks/useLocale';
import { Button, Helper } from '@ui/basics';
import { MyButtonProps } from '@custom-types/ui/basics/button';
import styles from './dropzone.module.css';
import {
  errorNotification,
  newNotification,
} from '@utils/notificationFunctions';

const Dropzone: FC<{
  children: ReactNode;
  onDrop: (_: any) => void;
  title: string;
  description: string;
  plural?: boolean;
  additionalButtons?: ReactNode;
  accept?: string[];
  maxSize?: number;
  helperContent?: string[];

  showButton?: boolean;
  buttonProps?: MyButtonProps;
  disabled?: boolean;
}> = ({
  children,
  onDrop,
  plural,
  accept,
  title,
  description,
  maxSize,
  additionalButtons,
  helperContent,

  showButton,
  buttonProps,
  disabled,
}) => {
  const { locale } = useLocale();

  const openRef = useRef(() => {});
  const draggable = useRef<HTMLDivElement>(null);
  const [drag, setDragInner] = useState(0);
  const dragStart = useCallback(() => {
    setDragInner((drag) => drag + 1);
  }, []);
  const dragEnd = useCallback(() => {
    setDragInner((drag) => drag - 1);
  }, []);

  useEffect(() => {
    const current = draggable.current;
    if (current) {
      current.addEventListener('dragenter', dragStart);
      current.addEventListener('dragleave', dragEnd);
    }
    return () => {
      if (current) {
        current.removeEventListener('dragenter', dragStart);
        current.removeEventListener('dragleave', dragEnd);
      }
    };
  }, [draggable, dragStart, dragEnd]);

  return (
    <div ref={draggable} style={{ position: 'relative' }}>
      <MantineDropzone
        openRef={openRef}
        disabled={disabled}
        accept={accept}
        maxSize={maxSize}
        onDrop={(files) => {
          dragEnd();
          onDrop(files);
        }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          visibility: drag > 0 ? 'visible' : 'hidden',
        }}
        onReject={(e) => {
          dragEnd();
          e.forEach((item) => {
            const id = newNotification({});
            const errorCode = item.errors[0]
              .code as keyof typeof locale.ui.dropzone.errors;
            const filename = item.file?.name || '';
            errorNotification({
              id,
              title: locale.ui.dropzone.errors[errorCode].title,
              message: locale.ui.dropzone.errors[errorCode].message(filename),
              autoClose: 5000,
            });
          });
          console.error(e);
        }}
      >
        <Group
          align="center"
          gap="xl"
          style={{ minHeight: 220, pointerEvents: 'none' }}
        >
          <MantineDropzone.Accept>
            <FileUpload
              style={{
                width: 80,
                height: 80,
                color: 'white',
              }}
            />
          </MantineDropzone.Accept>
          <MantineDropzone.Reject>
            <CircleX
              style={{
                width: 80,
                height: 80,
                color: 'white',
              }}
            />
          </MantineDropzone.Reject>
          <MantineDropzone.Idle>
            <Photo
              style={{
                width: 80,
                height: 80,
                color: 'white',
              }}
            />
          </MantineDropzone.Idle>

          <div>
            <Text size="xl" inline>
              {title}
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              {description}
            </Text>
          </div>
        </Group>
      </MantineDropzone>

      {!disabled && showButton && (
        <div className={styles.buttons}>
          <Button
            variant="outline"
            onClick={() => openRef.current()}
            targetWrapperStyle={{
              display: drag > 0 ? 'none' : 'block',
            }}
            {...buttonProps}
          >
            {plural
              ? locale.ui.codeArea.selectFiles
              : locale.ui.codeArea.selectFile}
          </Button>
          {helperContent && (
            <Helper
              dropdownContent={
                <div>
                  {helperContent.map((p, index) => (
                    <p key={index}>{p}</p>
                  ))}
                </div>
              }
              customIcon={<AlertCircle color={'var(--negative)'} />}
            />
          )}
          {additionalButtons}
        </div>
      )}
      {children}
    </div>
  );
};

export default memo(Dropzone);
