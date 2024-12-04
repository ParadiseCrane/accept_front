import { FC, memo, useState } from 'react';
import Description from '@components/Task/Description/Description';
import { Eye } from 'tabler-icons-react';
import SingularSticky from '@ui/Sticky/SingularSticky';
import { STICKY_SIZES } from '@constants/Sizes';
import { useWidth } from '@hooks/useWidth';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import { useLocale } from '@hooks/useLocale';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';

const Preview: FC<{ form: any }> = ({ form }) => {
  const { locale } = useLocale();
  const [openedHint, setOpenedHint] = useState(false);
  const { width } = useWidth();
  return (
    <div style={{ zoom: '80%' }}>
      {form.values.hasHint && (
        <SimpleModal
          title={locale.task.form.hint.title}
          opened={openedHint}
          close={() => setOpenedHint(false)}
        >
          <div
            children={
              <TipTapEditor
                editorMode={false}
                content={form.values.hintContent}
                onUpdate={() => {}}
              />
            }
          />
        </SimpleModal>
      )}
      <Description
        task={{
          ...form.values,
          constraints: {
            time: form.values.constraintsTime,
            memory: form.values.constraintsMemory,
          },
        }}
        setShowHint={() => {}}
        preview
      />
      {form.values.hasHint && (
        <SingularSticky
          color="var(--accent)"
          icon={
            <Eye
              width={STICKY_SIZES[width] / 3}
              height={STICKY_SIZES[width] / 3}
            />
          }
          onClick={() => setOpenedHint(true)}
          description={locale.tip.sticky.task.hint}
        />
      )}
    </div>
  );
};

export default memo(Preview);
