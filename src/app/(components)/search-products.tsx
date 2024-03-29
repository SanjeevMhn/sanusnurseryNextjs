'use client'
import { useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { useDispatch } from 'react-redux';
import { hideDialog, initialDialogState } from '../lib/dialog/dialogSlice';
import api from '../service/interceptor/interceptor';

const SearchProducts = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResult, setSearchResult] = useState<Array<any>>([]);
    const dispatch = useDispatch();

    const handleInputChange = (e: any) => {
        setSearchTerm(e.target.value)
    }

    const handleHideDialog = () => {
        dispatch(hideDialog());
    }

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            try {
                if (searchTerm !== '') {
                    let response = await api.get(`${baseUrl}/products/name?prod_name=${searchTerm}`);
                    let data = await response.data;
                    setSearchResult(data.products);
                } else {
                    setSearchResult([])
                }

            } catch (e) {
                console.error(e)
            }
        }, 900)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [searchTerm])
    return (
        <>
            <div className="input-group">
                <input type="text" name="" id="" placeholder="Plant Name..." onChange={handleInputChange} value={searchTerm} autoFocus />
                <button className="search-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>
                </button>
            </div>
            <div className="search-content w-full">
                <ul className="search-result-list mt-4 flex flex-col gap-2">
                    {
                        searchResult.map((sr: any, index: number) => {
                            return (
                                <li className="list-item" key={index}>
                                    <Link href={`/product/${sr.prod_id}`} className="product-item flex items-center gap-2" replace onClick={() => handleHideDialog()}>
                                        <div className="img-container w-[75px] h-[75px] flex items-center justify-center">
                                            <img src={sr.prod_img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="product-name">{sr.prod_name}</div>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}

export default SearchProducts;
