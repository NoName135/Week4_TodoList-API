import RingLoader from 'react-spinners/RingLoader';

const RingLoading = () => {
  return (
    <div className="loading-wrap">
      <div className="loading">
        <RingLoader
          color="#FCE974"
          cssOverride={{}}
          loading
          size={72}
          speedMultiplier={2}
        />
      </div>
    </div>
  );
}

export default RingLoading;
