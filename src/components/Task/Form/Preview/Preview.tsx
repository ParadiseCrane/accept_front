import Description from '@components/Task/Description/Description';
import { STICKY_SIZES } from '@constants/Sizes';
import { useLocale } from '@hooks/useLocale';
import { useWidth } from '@hooks/useWidth';
import { TipTapEditor } from '@ui/basics/TipTapEditor/TipTapEditor';
import SimpleModal from '@ui/SimpleModal/SimpleModal';
import SingularSticky from '@ui/Sticky/SingularSticky';
import { FC, memo, useState } from 'react';
import { Eye } from 'tabler-icons-react';

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
          <div>
            <TipTapEditor
              editorMode={false}
              content={form.values.hintContent}
              onUpdate={() => {}}
            />
          </div>
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
