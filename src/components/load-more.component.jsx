


const LoadMoreDataBtn = ({ state, fetchDataFun, additionalParam }) =>{
   
    if(state != null && state.totalDocs > state.results.length){
        return (
         
            <button
                onClick={() => fetchDataFun({  ...additionalParam,   page: state.page  + 1 } )}
                className="loadmore"
            >
                Load More
            </button>

        )
    }


}

export default LoadMoreDataBtn;