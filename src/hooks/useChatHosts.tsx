import { IActivity } from '@custom-types/data/atomic';
import { IUserDisplay } from '@custom-types/data/IUser';
import { pureCallback, setter } from '@custom-types/ui/atomic';
import { sendRequest } from '@requests/request';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useRefetch } from './useRefetch';

export interface IHostData {
  user: IUserDisplay;
  amount: number;
}

interface IChatHostsContext {
  hosts: IHostData[];
  loading: boolean;
  hasNewMessages: boolean;
  updatesCounter: number;
  refetch: pureCallback;
  selectHost: setter<string>;
}

const ChatHostsContext = createContext<IChatHostsContext>(null!);

export const ChatHostsProvider: FC<{
  children: ReactNode;
  entity: IActivity;
  spec: string;
  updateIntervalSeconds: number;
}> = ({ children, entity, spec, updateIntervalSeconds }) => {
  const [hosts, setHosts] = useState<IHostData[]>([]);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchInitialHosts = useCallback(() => {
    setLoading(true);
    return sendRequest<{ entity: IActivity; spec: string }, IHostData[]>(
      'hosts/all',
      'POST',
      {
        entity,
        spec,
      }
    ).then((res) => {
      if (!res.error) {
        let sorted = res.response.sort((a, b) => b.amount - a.amount);
        setHasNewMessages(sorted.length > 0 ? sorted[0].amount > 0 : false);
        setHosts(sorted);
        setLoading(false);
      }
    });
  }, [entity, spec]);

  const selectHost = useCallback((login: string) => {
    setHosts((old_hosts) => {
      const index = old_hosts.findIndex((item) => item.user.login == login);
      if (index >= 0) {
        old_hosts[index].amount = 0;
      }
      return [...old_hosts];
    });
  }, []);

  useEffect(() => {
    fetchInitialHosts();
  }, [fetchInitialHosts]);

  const { updatesCounter } = useRefetch(
    fetchInitialHosts,
    updateIntervalSeconds
  );

  const value = useMemo<IChatHostsContext>(
    () => ({
      hosts,
      loading,
      updatesCounter,
      hasNewMessages,
      refetch: fetchInitialHosts,
      selectHost,
    }),
    [
      hasNewMessages,
      hosts,
      loading,
      updatesCounter,
      selectHost,
      fetchInitialHosts,
    ]
  );

  return (
    <ChatHostsContext.Provider value={value}>
      {children}
    </ChatHostsContext.Provider>
  );
};

export function useChatHosts() {
  return useContext(ChatHostsContext);
}
