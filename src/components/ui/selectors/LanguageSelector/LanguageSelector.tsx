import { useLocale } from '@hooks/useLocale';

import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './languageSelector.module.css';
import { sendRequest } from '@requests/request';
import { ILanguage } from '@custom-types/data/atomic';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import { Item, setter } from '@custom-types/ui/atomic';
import { ICustomTransferListData } from '@custom-types/ui/basics/customTransferList';

const LanguageSelector: FC<{
  initialLangs: Item[];
  setUsed: setter<any>;
  shrink?: boolean;
  fetchURL: string;
  width: string;
}> = ({ setUsed, shrink, initialLangs, fetchURL, width }) => {
  const { locale } = useLocale();
  const [allLangs, setAllLangs] = useState<ILanguage[]>([]);
  const [langs, setLangs] =
    useState<ICustomTransferListData>(undefined);
  const initialLangsInner = useMemo(() => initialLangs, []); //eslint-disable-line

  const onChange = useCallback(
    (data: ICustomTransferListData) => {
      if (!!!data) return;
      setUsed(data[1].map((item) => item.login));
      setLangs(data);
    },
    [setUsed]
  );

  useEffect(() => {
    let data: ICustomTransferListData = [[], []];
    const selectedSpecs = initialLangsInner.map((item) => item.value);

    for (let i = 0; i < allLangs.length; i++) {
      const lang = {
        ...allLangs[i],
        value: allLangs[i].spec.toString(),
        label: allLangs[i].name,
        sortValue: allLangs[i].name,
      };
      if (selectedSpecs.includes(lang.value)) {
        data[1].push(lang);
      } else {
        data[0].push(lang);
      }
    }
    setLangs(data);
  }, [initialLangsInner, allLangs]);

  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    sendRequest<{}, ILanguage[]>(
      fetchURL,
      'GET',
      undefined,
      600000
    ).then((res) => {
      if (res.error) return;
      setAllLangs(res.response);
      setLoading(false);
    });
  }, [fetchURL]);

  useEffect(() => {
    refetch();
  }, []); // eslint-disable-line

  return (
    <div className={styles.wrapper}>
      {!loading && (
        <CustomTransferList
          value={langs}
          titles={[
            locale.ui.langSelector.available,
            locale.ui.langSelector.used,
          ]}
          shrink={shrink}
          onChange={onChange}
          searchKeys={['name']}
          width={width}
        />
      )}
    </div>
  );
};

export default memo(LanguageSelector);
