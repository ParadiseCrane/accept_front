import { IPlotData } from '@custom-types/ui/IPlot';
import { FC, memo, useCallback, useMemo, useState } from 'react';

import styles from './arc.module.css';

const Arc: FC<{
  label: string;
  amount: number;
  color: string;
  prev: number;
  total: number;
  inner_radius: number;
  outer_radius: number;
  increase_ratio: number;
  setCenterText: (_: IPlotData | undefined) => void;
}> = ({
  label,
  color,
  amount,
  prev,
  total,
  inner_radius,
  outer_radius,
  increase_ratio,
  setCenterText,
}) => {
  const [outerRadius, setOuterRadius] = useState(outer_radius);

  const offset = useMemo(() => (2 * Math.PI * prev) / total, [prev, total]);
  const angle = useMemo(
    () => (2 * Math.PI * amount) / total - 0.01,
    [amount, total]
  );
  const largeAngleFlag = useMemo(() => (angle >= Math.PI ? 1 : 0), [angle]);
  const sn = useMemo(() => +Math.sin(angle).toFixed(5), [angle]);
  const cs = useMemo(() => +Math.cos(angle).toFixed(5), [angle]);
  const coords = useMemo(
    () => [
      `M 0 ${-outerRadius}`, // MoveTo
      `A ${outerRadius} ${outerRadius} 0 ${largeAngleFlag} 1 ${
        outerRadius * sn
      } ${-outerRadius * cs}`, // Arc
      `L ${inner_radius * sn} ${-inner_radius * cs}`, // LineTo
      `A ${inner_radius} ${inner_radius} 0 ${largeAngleFlag} 0 0 ${-inner_radius}`, // Arc
      'Z', // Close Path
    ],
    [cs, inner_radius, largeAngleFlag, outerRadius, sn]
  );
  const path = useMemo(() => coords.join(' '), [coords]);

  const onEnter = useCallback(() => {
    setCenterText({ label, amount, color });
    setOuterRadius(outer_radius * increase_ratio);
  }, [amount, color, increase_ratio, label, outer_radius, setCenterText]);
  const onLeave = useCallback(() => {
    setCenterText(undefined);
    setOuterRadius(outer_radius);
  }, [outer_radius, setCenterText]);

  return (
    <path
      className={styles.arc}
      d={path}
      transform={`rotate(${(offset / Math.PI) * 180})`}
      fill={color}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    />
  );
};

export default memo(Arc);
