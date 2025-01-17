import { ITreeUnit } from '@custom-types/data/ICourse';
import { ICourseTreeActions, ICourseTreeCheckers } from '@hooks/useCourseTree';
import styles from './styles.module.css';

export interface IMovementModalProps {
  currentUnit: ITreeUnit;
  actions: ICourseTreeActions;
  checkers: ICourseTreeCheckers;
}

export const MovementModal: React.FC<IMovementModalProps> = ({
  currentUnit,
  actions,
  checkers,
}) => {
  return <div className={styles.modal_wrapper}></div>;
};
