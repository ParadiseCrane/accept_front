import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './chatPage.module.css';
import Chat from '@ui/Chat/Chat';
import { IChatMessage } from '@custom-types/data/IMessage';
import {
  Icon,
  Indicator,
  LoadingOverlay,
  TextInput,
  UserAvatar,
} from '@ui/basics';
import InitiateChatModal from './InitiateChatModal/InitiateChatModal';
import { useLocale } from '@hooks/useLocale';
import Fuse from 'fuse.js';
import { IHostData, useChatHosts } from '@hooks/useChatHosts';
import { Eye, Search } from 'tabler-icons-react';

const ChatPage: FC<{
  entity: string;
  type: 'tournament' | 'assignment';
}> = ({ entity, type }) => {
  const { locale } = useLocale();
  const [currentHost, setCurrentHost] = useState<string | undefined>(
    undefined
  );

  const [initialLoad, setInitialLoad] = useState(true);

  const {
    hosts,
    refetch: fetchInitialHosts,
    selectHost,
    loading,
  } = useChatHosts();

  const [searchedHosts, setSearchedHosts] =
    useState<IHostData[]>(hosts);

  const [searchString, setSearchString] = useState<string>('');

  const hostLogins = useMemo(
    () => hosts.map((item) => item.user.login),
    [hosts]
  );

  const handleHostSelection = useCallback(
    (host: IHostData) => {
      return () => {
        setCurrentHost(host.user.login);
        selectHost(host.user.login);
      };
    },
    [selectHost]
  );

  const handleSearch = useCallback(() => {
    if (hosts.length == 0) return;
    if (searchString.length == 0) return setSearchedHosts(hosts);
    const fuse = new Fuse(hosts, {
      keys: ['user.login', 'user.shortName'],
      findAllMatches: true,
    });
    const searched = fuse
      .search(searchString)
      .map((item) => item.item);
    setSearchedHosts(searched);
  }, [hosts, searchString]);

  useEffect(() => {
    const id = setTimeout(handleSearch, 200);
    return () => {
      clearTimeout(id);
    };
  }, [handleSearch]);

  // const initialLoad = updatesCounter == 0;

  useEffect(() => {
    if (!loading) setInitialLoad(false);
  }, [loading]);

  return (
    <div className={styles.wrapper}>
      <LoadingOverlay visible={initialLoad} />
      {initialLoad ? (
        <></>
      ) : (
        <>
          {hosts.length == 0 ? (
            <div className={styles.emptyMessageWrapper}>
              <div className={styles.emptyMessage}>
                <div>{locale.dashboard.chat.emptyMessage}</div>
                <InitiateChatModal
                  entity={entity}
                  type={type}
                  exclude={hostLogins}
                  onSuccess={fetchInitialHosts}
                  small
                />
              </div>
            </div>
          ) : (
            <div className={styles.hostsWrapper}>
              <TextInput
                icon={<Search />}
                onChange={(e) =>
                  setSearchString(e.target.value.trim())
                }
                placeholder={locale.dashboard.chat.search.placeholder}
              />
              <div className={styles.hostList}>
                {searchedHosts.length > 0 ? (
                  <div className={styles.hosts}>
                    {searchedHosts.map((host, index) => (
                      <div
                        className={`${styles.hostWrapper} ${
                          host.user.login == currentHost
                            ? styles.currentHost
                            : ''
                        }`}
                        key={index}
                      >
                        <div
                          className={styles.clickableUser}
                          onClick={handleHostSelection(host)}
                        >
                          <Indicator
                            offset={2}
                            label={host.amount}
                            disabled={host.amount == 0}
                            scale="sm"
                          >
                            <UserAvatar
                              radius="md"
                              size="md"
                              login={host.user.login}
                              alt={'Users avatar'}
                            />
                          </Indicator>
                          <div className={styles.hostName}>
                            {host.user.shortName}
                          </div>
                        </div>
                        <Icon
                          href={`/profile/${host.user.login}`}
                          target="_blank"
                          tabIndex={5}
                          color="var(--primary)"
                          variant="transparent"
                          size="xs"
                        >
                          <Eye />
                        </Icon>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.nothingFound}>
                    {locale.dashboard.chat.search.nothingFound}
                  </div>
                )}
              </div>
              <InitiateChatModal
                entity={entity}
                type={type}
                exclude={hostLogins}
                onSuccess={fetchInitialHosts}
              />
            </div>
          )}
          {currentHost !== undefined && window && (
            <div className={styles.chat}>
              <Chat
                key={currentHost}
                entity={entity}
                host={currentHost}
                opened={true}
                isMessageMine={(message: IChatMessage) => {
                  return !(message.author === currentHost);
                }}
                wrapperStyles={styles.chatWrapper}
                moderator={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(ChatPage);
