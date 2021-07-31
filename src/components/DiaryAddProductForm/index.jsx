import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { diaryOperations } from '../../redux/diary';
import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';
import { DebounceInput } from 'react-debounce-input';

import styles from '../DiaryAddProductForm/DiaryAddProductForm.module.css';

axios.defaults.headers.common['Authorization'] =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTA0ZjRiNjJiODVmYTAwMWMyMmFlZDYiLCJlbWFpbCI6ImxhaW1hdkBnbWFpbC5jb20iLCJpYXQiOjE2Mjc3MTQ3NDJ9.600zEwSXhkCYvV1Tzml5wZ7fmI22-pA_R7x9gwi5X3s';

const isMobile = window.screen.width < 768;

export default function DiaryAddProductForm() {
    const [productName, setProductName] = useState('');
    const [productWeight, setProductWeight] = useState('');
    const [query, setQuery] = useState('');
    const [datalist, setDatalist] = useState([]);
    const dispatch = useDispatch();

    const handleFormSubmit = event => {
        event.preventDefault();
        setProductName(query);
        dispatch(diaryOperations.addProduct({ query, productWeight }));
    };

    const fetchProducts = async searchQuery => {
        try {
            const { data } = await axios.get(
                `https://obscure-shelf-16384.herokuapp.com/api/products?input=${searchQuery}`,
            );
            setDatalist(data.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleChange = useCallback(event => {
        setQuery(event.target.value);
    }, []);

    const onChangeProductWeight = useCallback(event => {
        setProductWeight(event.target.value);
    }, []);

    useEffect(() => {
        if (query !== '') {
            fetchProducts(query);
        }
    }, [query]);

    return (
        <div>
            <form className={styles.addProductForm} onSubmit={handleFormSubmit}>
                <DebounceInput
                    minLength={2}
                    debounceTimeout={1000}
                    className={styles.inputAddProductFormName}
                    id="productName"
                    name="productName"
                    type="productName"
                    value={productName}
                    onChange={handleChange}
                    placeholder="Введите название продукта"
                    required
                    list="products-for-add"
                    autoComplete="off"
                />

                <datalist id="products-for-add">
                    {datalist.map(({ title }) => (
                        <option value={title.ru} key={uuidv4()}></option>
                    ))}
                </datalist>

                <input
                    className={styles.inputAddProductFormAmount}
                    id="grams"
                    name="productWeight"
                    type="grams"
                    value={productWeight}
                    onChange={onChangeProductWeight}
                    placeholder="Граммы"
                    required
                    autoComplete="off"
                />
                {isMobile ? (
                    <button
                        type="submit"
                        className={styles.buttonAddProductMobile}
                    >
                        Добавить
                    </button>
                ) : (
                    <button type="submit" className={styles.buttonAddProduct}>
                        +
                    </button>
                )}
            </form>
        </div>
    );
}
