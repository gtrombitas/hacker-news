import { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { getTopStories } from '../api';
import { Item } from '../dataTypes';
import './HackerNewsTable.css';
import StyledButton from './StyledButton';

const itemsPerPage = 15;

export default function HackerNewsTable() {
    const [items, setItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const reloadData = () => {
        setLoading(true);
        getTopStories()
            .then(stories => {
                setItems(stories);
                setLoading(false);
                setCurrentPage(1);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }

    useEffect(() => {
        reloadData();
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    const nextPage = () => {
        if (currentPage < Math.ceil(items.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const dataRows = currentItems.filter(item => !!item.url).map(item => (
        <tr key={item.id}>
            <td>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="textlink">{item.title}</a>
            </td>
        </tr>
    ));

    return (
        <div>
            <table id="table_news">
                <thead>
                    <tr>
                        <th>Hacker News</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ?
                        <tr>
                            <td>
                                <div className="data_loader">
                                    <ThreeDots
                                        height="80"
                                        width="80"
                                        radius="9"
                                        color="#4fa94d"
                                        ariaLabel="three-dots-loading"
                                        visible={true}
                                    />
                                    <div>Data is loading</div>
                                </div>
                            </td>
                        </tr> :
                        dataRows}
                </tbody>
                {!loading && <tfoot>
                    <tr>
                        <td style={{ display: 'flex', flexDirection: 'row', whiteSpace: 'nowrap' }}>
                            <div className="gutter" style={{ flex: 3 }}>
                                <StyledButton onClick={prevPage} disabled={currentPage === 1}>
                                    Previous
                                </StyledButton>
                                <span>Page {currentPage}</span>
                                <StyledButton onClick={nextPage} disabled={currentPage === Math.ceil(items.length / itemsPerPage)}>
                                    Next
                                </StyledButton>
                            </div>
                            <div className="gutter" style={{ flex: 1 }}>
                                <ReactTooltip id="reload-tooltip" place="bottom" content="Reload Data" />
                                <StyledButton onClick={reloadData} disabled={loading} icon="refresh" data-tooltip-id="reload-tooltip" />
                            </div>
                        </td>
                    </tr>
                </tfoot>}
            </table>
        </div >
    );
}