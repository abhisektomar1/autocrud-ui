import { Helmet } from 'react-helmet';

const CustomHelmet = ({ title, description, keywords }:{ title:string, description:string, keywords:string }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {/* You can add more meta tags or other head elements here */}
    </Helmet>
  );
};

export default CustomHelmet;