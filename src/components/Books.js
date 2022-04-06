import {useEffect, useState} from "react"
// 引包
import {
    getFirestore,   // 连接数据库
    collection,     // 取得指定的集合
    getDocs,        // 获取全部数据方式一
    addDoc,         // 添加数据
    deleteDoc, doc, // 根据数据库、集合和id删除指定的数据
    onSnapshot,     // 获取全部数据方式二：实时根据firestore中的数据更新UI；推荐！
    query, where,   // 根据指定条件过滤数据
    orderBy,        // 用于排序
    serverTimestamp,// 用户创建timestamp
    getDoc,         // 根据指定条件查询某条数据
    updateDoc,      // 更新数据
} from 'firebase/firestore'
import {initializeApp} from "firebase/app";
import firebaseConfig from '../config/firebase-config'

const Books = () => {
    useEffect( () => {
        // getAllBooks()
        getAllBooksRealTimeUpdate()
    }, []);

    const [books, setBooks] = useState([])

    // 链接数据库和指定的集合
    // 初始化firebase
    initializeApp(firebaseConfig)
    // 创建firestore
    const db = getFirestore()
    // 获取指定的firestore中指定的集合，如books集合
    const colRef = collection(db, 'books')

    // 查询所有数据方法一：
    const getAllBooks = async ()=>{
        // 获取指定的集合中的文档
        // snapshot是返回来的结果；里面包含了很多信息；
        // 其中最有用的信息就是snapshot.docs，也就是所有的数据
        // 但也不能直接使用，我们需要使用遍历拿到数据
        const snapshot = await getDocs(colRef)
        console.log(snapshot.docs)
        // 数据存在了每个doc.data()方法中
        const allBooks = snapshot.docs.map(doc => {
            return {...doc.data(), id: doc.id}
        })
        setBooks(allBooks)
    }

    // 查询所有数据方法二：推荐！
    // 实时根据firestore中的数据更新UI
    const getAllBooksRealTimeUpdate = () =>{
        // 第一个参数：指定使用的集合
        // 第二个参数：每当指定的集合中的数据发生变化时，就运行这个函数
        // 并设置监控，一旦有变化，则刷新UI
        onSnapshot(colRef, (snapshot) => {
            const allBooks = snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id}
            })
            setBooks(allBooks)
        })
    }

    // 根据指定条件过滤数据
    const getBookByAuthorName = async (author) => {
        // 指定集合名称以及查询条件
        const q = query(colRef, where("author", "==", author))
        // // 根据我们设置的条件，取得所有符合条件的数据，并设置监控，一旦有变化，则刷新UI
        onSnapshot(q, (snapshot) => {
            const allBooks = snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id}
            })
            setBooks(allBooks)
        })
    }

    // 添加数据
    const newBook = {
        title: 'hello world',
        author: 'Cong Wang',
        createdAt: serverTimestamp()
    }
    const addBook = async () => {
        // 向指定的集合中添加指定的数据
        await addDoc(colRef, newBook)
    }

    // 根据id删除数据
    const deleteBook = async (id) => {
        // 先根据数据库、集合和id值指定想删除的数据；注意！不是找到，而是指定！
        // 取得指定的数据
        const docRef = doc(db, 'books', id)
        // 指定数据后，进行删除
        await deleteDoc(docRef)
    }

    console.log(books)

    // 根据指定字段和规则进行排序
    const makeOrderByTitle = () => {
        // 使用orderBy()函数设置排序规则
        const q = query(colRef, orderBy('title', 'desc'))
        // 根据我们设置的条件，取得所有符合条件的数据，并设置监控，一旦有变化，则刷新UI
        onSnapshot(q, (snapshot) => {
            const allBooks = snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id}
            })
            setBooks(allBooks)
        })
    }

    // 根据数据创建的时间进行排序
    const makeOrderByTimeStamp = () => {
        // 使用orderBy()函数设置排序规则
        const q = query(colRef, orderBy('createdAt'))
        // 根据我们设置的条件，取得所有符合条件的数据，并设置监控，一旦有变化，则刷新UI
        onSnapshot(q, (snapshot) => {
            const allBooks = snapshot.docs.map(doc => {
                return {...doc.data(), id: doc.id}
            })
            setBooks(allBooks)
        })
    }

    // 根据id获取指定的一条数据
    const findBookById = async (id) => {
        // 根据条件指定某条数据
        const docRef = doc(db, 'books', id)
        // 方法一：不推荐
        // const theDoc = await getDoc(docRef)

        // 方法二：推荐！
        // 并设置监控，一旦有变化，则刷新UI
        // 只要这条数据发生变化，就会触发第二个参数的这个函数
        onSnapshot(docRef, (doc)=>{
            const newBooks = [{...doc.data(), id:doc.id}]
            setBooks(newBooks)
        })
    }

    // 更新数据
    const updateData = async (id) => {
        // 指定要更新的那条数据
        const docRef = doc(db, 'books', id)
        // 更新数据
        await updateDoc(docRef, {
            title: 'Updated title',
        })
    }

    return (
        <div className="App">
            <ul>
                {
                    books.map(book=>{
                        return (
                            <li key={book.id}>
                                {book.title}-{book.author}
                                <button onClick={()=>deleteBook(book.id)}>Delete</button>
                            </li>

                        )
                    })
                }
            </ul>

            <button onClick={()=>addBook()}>Add</button>
            <button onClick={()=>getBookByAuthorName('Cong Wang')}>Find books written by Cong Wang</button>
            <button onClick={()=>makeOrderByTitle()}>Order by title</button>
            <button onClick={()=>makeOrderByTimeStamp()}>Order by timestamp</button>
            <button onClick={()=>findBookById('cFUcl0ThOxrBY9xzBP5B')}>Find book by id 'cFUcl0ThOxrBY9xzBP5B'</button>
            <button onClick={()=>updateData('cFUcl0ThOxrBY9xzBP5B')}>Update book by id 'cFUcl0ThOxrBY9xzBP5B'</button>

        </div>
    );
}

export default Books
