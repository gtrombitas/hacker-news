import React, { useEffect, useState } from 'react';
import { Item } from '../dataTypes';
import { getTopStories } from '../api';
import { ThreeDots } from 'react-loader-spinner';

const itemsPerPage = 20;

export default function HackerNewsTable() {
    const [items, setItems] = useState<Item[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getTopStories()
            .then(stories => {
                setItems(stories);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
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

    const rows = currentItems.map(item => (
        <tr key={item.id}>
            <td>
                <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
            </td>
        </tr>
    ));

    return (
        <div>
            <div>
                <div>Hacker News</div>
            </div>
            {
                loading ?
                    <div>
                        <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="#4fa94d"
                            ariaLabel="three-dots-loading"
                            visible={true}
                        />
                        <div>Data is loading</div>
                    </div> :
                    <table>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
            }
            <div>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(items.length / itemsPerPage)}>
                    Next
                </button>
            </div>
        </div>
    );
}