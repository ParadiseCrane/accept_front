import { IActivityData } from '@custom-types/data/atomic';
import { IPlotData } from '@custom-types/ui/IPlot';
import { sendRequest } from '@requests/request';
import { BarPlot } from '@ui/Plot';
import { FC, memo, useEffect, useState } from 'react';

const HOUR = 60 * 60 * 1000;

const mapActivityToPlotData = (activity: IActivityData[]): IPlotData[] => {
  if (activity.length == 0) return [];
  const sorted_activity = activity
    .map((item) => ({
      count: item.count,
      date: new Date(item.date).getTime(),
    }))
    .sort((a, b) => a.date - b.date);

  let full_activity = new Array();

  full_activity.push(sorted_activity[0]);
  for (let i = 1; i < sorted_activity.length; i++) {
    const current = sorted_activity[i];
    let last = full_activity[full_activity.length - 1];
    while (current.date - last.date > HOUR) {
      full_activity.push({
        count: 0,
        date: last.date + HOUR,
      });
      last = full_activity[full_activity.length - 1];
    }
    full_activity.push(current);
  }

  return full_activity.map((item, index) => ({
    amount: item.count,
    label:
      index == 0 || index == full_activity.length - 1
        ? new Date(item.date).toLocaleString()
        : '',
    color: 'var(--primary)',
  }));
};

const ActivityGraph: FC<{}> = () => {
  const [data, setData] = useState<IPlotData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    sendRequest<{ from_date: Date; to_date: Date }, IActivityData[]>(
      'analytics/activity',
      'POST',
      { to_date: new Date(), from_date: new Date(0) }
    ).then((res) => {
      if (!res.error) {
        setData(mapActivityToPlotData(res.response));
      }
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <BarPlot hideColorSwatch hideRowLabels data={data} aspectRatio={0.1} />
    </div>
  );
};

export default memo(ActivityGraph);
