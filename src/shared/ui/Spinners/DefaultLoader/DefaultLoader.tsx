import './DefaultLoader.scss';

interface DefaultLoaderProps {
  className?: string;
}

export const DefaultLoader = (props: DefaultLoaderProps) => {
  const { className } = props;
  return <span className="loader"></span>;
};
