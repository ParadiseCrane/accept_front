import { useLocale } from '@hooks/useLocale';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { sendRequest } from '@requests/request';
import { ITag } from '@custom-types/data/ITag';
import CustomTransferList from '@ui/basics/CustomTransferList/CustomTransferList';
import { TagItem } from './TagItem/TagItem';
import { Item, setter } from '@custom-types/ui/atomic';
import {
  ICustomTransferListData,
  ICustomTransferListItemComponent,
} from '@custom-types/ui/basics/customTransferList';
import AddTag from './AddTag/AddTag';

const TagSelector: FC<{
  initialTags: Item[];
  setUsed: setter<Item[]>;
  shrink?: boolean;
  fetchURL: string;
  addURL: string;
  updateURL: string;
  deleteURL: string;
  form: any;
  field: string;
  width?: string;
}> = ({
  setUsed,
  shrink,
  initialTags,
  fetchURL,
  addURL,
  updateURL,
  deleteURL,
  form,
  field,
  width,
}) => {
  const { locale } = useLocale();
  const initialTagsInner = useMemo(() => initialTags, []); //eslint-disable-line
  const [tags, setTags] =
    useState<ICustomTransferListData>(undefined);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);

  const onChange = useCallback(
    (data: ICustomTransferListData) => {
      if (!!!data) return;
      setUsed(data[1]);
      setTags(data);
    },
    [setUsed]
  );

  useEffect(() => {
    let data: ICustomTransferListData = [[], []];
    const selectedSpecs = initialTagsInner.map((item) => item.spec);

    for (let i = 0; i < allTags.length; i++) {
      const tag = {
        ...allTags[i],
        value: allTags[i].spec,
        sortValue: allTags[i].title,
      };
      if (selectedSpecs.includes(tag.spec)) {
        data[1].push(tag);
      } else {
        data[0].push(tag);
      }
    }
    setTags(data);
  }, [allTags, initialTagsInner]);

  const refetch = useCallback(async () => {
    setLoading(true);
    sendRequest<{}, ITag[]>(fetchURL, 'GET').then((res) => {
      if (res.error) return;
      setAllTags(res.response);
      setLoading(false);
    });
  }, [setAllTags, fetchURL]);

  useEffect(() => {
    refetch();
  }, []); // eslint-disable-line

  const itemComponent: ICustomTransferListItemComponent = useCallback(
    ({ item, onClick, index }) => {
      return (
        <TagItem
          key={index}
          item={item}
          onSelect={onClick}
          refetch={refetch}
          updateURL={updateURL}
          deleteURL={deleteURL}
          shrink={shrink}
        />
      );
    },
    [refetch, updateURL, deleteURL, shrink]
  );

  return (
    <CustomTransferList
      loading={loading}
      titles={[
        locale.ui.tagSelector.available,
        locale.ui.tagSelector.used,
      ]}
      itemComponent={itemComponent}
      extraActions={[
        [<AddTag key={1} addURL={addURL} refetch={refetch} />],
        [],
      ]}
      shrink={shrink}
      searchKeys={['title']}
      {...form.getInputProps(field)}
      value={tags}
      onChange={onChange}
      width={width}
    />
  );
};

export default memo(TagSelector);
