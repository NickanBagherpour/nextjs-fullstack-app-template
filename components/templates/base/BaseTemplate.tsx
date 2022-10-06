import styles from './BaseTemplate.module.css';

export interface IBaseTemplate {
  sampleTextProp: string;
}

const BaseTemplate: React.FC<IBaseTemplate> = ({ sampleTextProp }) => {
  return (
    <div
      className={
        styles.container /* 'relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12' */
      }
    >
      {sampleTextProp}
    </div>
  );
};

export default BaseTemplate;

