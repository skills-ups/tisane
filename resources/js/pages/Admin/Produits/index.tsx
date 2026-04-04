// page pour gerer les produit et pour ajouter les produits
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard } from '@/routes';
import { FileQuestionIcon, Info } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Modal from '@/components/Modal';

export default function AdminProduits() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Gérer les produits', href: '/admin/produits' },
    ];
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const { url, auth } = usePage().props;
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState(0);
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [stockNumber, setStockNumber] = useState(0);
    const isLogged = !!auth.user;
    const [dataget, setDataGet] = useState([]);
    const [modfiName, setModfiName] = useState('');
    const [modfiDescription, setModfiDescription] = useState('');
    const [modfiPrice, setModfiPrice] = useState(0);
    const [modfiCategory, setModfiCategory] = useState('');
    const [modfiStock, setModfiStock] = useState('');
    const [modfiStockNumber, setModfiStockNumber] = useState(0);


    // On surveille 'dataget'
    useEffect(() => {
        if (dataget) {
            setModfiName(dataget.name || '');
            setModfiDescription(dataget.description || '');
            setModfiPrice(dataget.price || 0);
            setModfiCategory(dataget.category || '');
            setModfiStock(dataget.stock || '');
            setModfiStockNumber(dataget.stock_number || 0);

        }
    }, [dataget]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],

        },
        multiple: true,
        onDrop: (acceptedFiles) => {
            setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Ajout des nouveaux fichiers aux fichiers existants
            dataget != null && setDataGet((prevData: any) => ({
                ...prevData,
                image: [...(prevData.image || []), ...acceptedFiles], // Ajout des nouveaux fichiers à l'état dataget
            }));
        },
    });
    const removeFile = (file: File) => {
        setUploadedFiles((prevFiles) => prevFiles.filter((f) => f !== file)); // Retire le fichier sélectionné de la liste des fichiers uploadés
        dataget != null && setDataGet((prevData: any) => ({
            ...prevData,
            image: prevData.image.filter((f: File) => f !== file), // Retire le fichier sélectionné de l'état dataget
        }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ici on envoie les données du formulaire au serveur pour ajouter le produit à la base de données et on affiche un message de succès ou d'erreur en fonction de la réponse du serveur
        const formData = new FormData();
        formData.append('name', nom);
        formData.append('description', description);
        formData.append('price', prix.toString());
        formData.append('category', category);
        formData.append('stock', stock);
        formData.append('stock_number', stockNumber.toString());
        uploadedFiles.forEach((file, index) => {
            formData.append(`image[${index}]`, file); // Ajoute chaque fichier avec un nom unique
        });
        const res = axios.post('/produits', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        toast.promise(res, {
            loading: 'Ajout du produit en cours...',
            success: () => {
                setIsAddingProduct(false);
                setUploadedFiles([]);
                setNom('');
                setDescription('');
                setPrix(0);
                router.reload({ only: ['auth'] });
                return 'Produit ajouté avec succès !';
            },
            error: 'Erreur lors de l\'ajout du produit.'
        });
    };
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', modfiName);
        formData.append('description', modfiDescription);
        formData.append('price', modfiPrice.toString());
        formData.append('category', modfiCategory);
        formData.append('stock', modfiStock);
        formData.append('stock_number', modfiStockNumber.toString());

        // Indiquer au serveur que c'est un PUT même si on utilise POST
        formData.append('_method', 'PUT');

        if (dataget.image && dataget.image.length > 0) {
            dataget.image.forEach((file) => {
                if (file instanceof File) {
                    formData.append('new_images[]', file);
                } else {
                    formData.append('old_images[]', file);
                }
            });
        } else {
            // On envoie un signal pour dire "Zéro image"
            formData.append('empty_images', 'true');
        }

        const res = axios.post(`/produits/${dataget.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.promise(res, {
            loading: 'Modification du produit en cours...',
            success: () => {
                // Ici, utilisez closeModal() ou setDataget(null) 
                // pour fermer la modal correctement
                setDataGet([]);
                router.reload({ only: ['auth'] });
                return 'Produit modifié avec succès !';
            },
            error: (err) => `Erreur : ${err.response?.data?.message || err.message}`
        });
    };

    const handleSuppression = (e: any) => {
        const res = axios.post('/supprimer/produit', { id: e });
        toast.promise(res, {
            loading: 'Suppression du produit en cours...',
            success: () => {

                router.reload({ only: ['auth'] });
                return 'Produit Supprimer avec succès !';
            },
            error: (err) => `Erreur : ${err.response?.data?.message || err.message}`
        });
    }
    // Ajout d'un état pour gérer l'image sélectionnée
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Fonction pour fermer la modale
    const closeModal = () => {
        setDataGet([]);
        setSelectedImage(null);
    };

    // Ajout d'un état pour gérer l'index de l'image active dans le carrousel
    const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({});

    // Fonction pour naviguer dans le carrousel
    const nextImage = (images: string[], produitId: number) => {
        setActiveImageIndexes((prevIndexes) => ({
            ...prevIndexes,
            [produitId]: (prevIndexes[produitId] + 1) % images.length,
        }));
    };

    const prevImage = (images: string[], produitId: number) => {
        setActiveImageIndexes((prevIndexes) => ({
            ...prevIndexes,
            [produitId]: (prevIndexes[produitId] - 1 + images.length) % images.length,
        }));
    };

    // Ajout d'un intervalle pour faire défiler automatiquement les images dans le carrousel// Suppression des dépendances inutiles pour éviter les changements de taille

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gérer les produits" />
            <Toaster />
            <div>

                <main className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold mb-4">Gérer les produits</h1>
                    {/* ici il y a deux blocs , mes produits et ajouter un produit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Si on clic sur ajouter un produit le contenu change en ajoute et on ne change pas de page */}
                        <div className="bg-white p-6 rounded-lg shadow" onClick={() => setIsAddingProduct(!isAddingProduct)}>
                            <h2 className="text-xl font-semibold mb-4">Ajouter un produit</h2>
                            {/* ici on affiche un formulaire pour ajouter un produit */}
                            <p>Utilisez ce formulaire pour ajouter un nouveau produit à votre boutique ou pour annuler l'opération.</p>
                        </div>
                    </div>
                    <br />
                    {isAddingProduct && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau produit</h2>
                            {/* ici on affiche un formulaire pour ajouter un produit */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom du produit</label>
                                    <input type="text" onChange={(e) => setNom(e.target.value)} id="name" name="name" className="w-full px-3 py-2 border rounded" />
                                </div>

                                <div className=" mt-4 mb-4 flex flex-col w-full md:flex-row md:space-x-4">
                                    <div>
                                        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Catégorie</label>
                                        <select onChange={(e) => setCategory(e.target.value)} id="category" name="category" className="w-full px-3 py-2 border rounded">
                                            <option value="">-- Sélectionnez une catégorie --</option>
                                            <option value="1">Tisane</option>
                                            <option value="2">Miel</option>
                                        </select>
                                    </div>
                                    <div className="mb-4 md:mb-0">
                                        <label htmlFor="stock_number" className="block text-gray-700 font-bold mb-2">Quantité en stock</label>
                                        <input type="number" onChange={(e) => setStockNumber(parseInt(e.target.value) || 0)} id="stock_number" name="stock_number" className="w-full px-3 py-2 border rounded" />
                                    </div>
                                    {/* stock  */}
                                    <div>
                                        <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">Stock</label>

                                        <select onChange={(e) => setStock(e.target.value)} id="stock" name="stock" className="w-full px-3 py-2 border rounded">
                                            <option value="">-- Sélectionnez d'abord une catégorie --</option>
                                            {category == '2' && (
                                                <>
                                                    <option value="pot_125g">Pot de 125g</option>
                                                    <option value="pot_250g">Pot de 250g</option>
                                                    <option value="pot_400g">Pot de 400g</option>
                                                    <option value="pot_500g">Pot de 500g</option>
                                                    <option value="pot_1kg">Pot de 1kg</option>
                                                    <option value="seau_5kg">Seau de 5kg</option>
                                                    <option value="litre">Litre (Vrac)</option>
                                                    <option value="kg">Kilo (Vrac)</option>
                                                </>
                                            )}
                                            {category == '1' && (
                                                <>
                                                    <option value="sachet_30g">Sachet de 30g</option>
                                                    <option value="sachet_50g">Sachet de 50g</option>
                                                    <option value="sachet_100g">Sachet de 100g</option>
                                                    <option value="boite_20_infusettes">Boîte de 20 infusettes</option>
                                                    <option value="vrac_kg">Vrac (au kg)</option>
                                                    <option value="sachet_individuel">Sachet individuel</option>
                                                </>
                                            )}
                                        </select>


                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-gray-700 font-bold mb-2">Prix</label>
                                        <input type="number" onChange={(e) => setPrix(parseFloat(e.target.value) || 0)} id="price" name="price" className="w-full px-3 py-2 border rounded" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description</label>
                                    <textarea onChange={(e) => setDescription(e.target.value)} id="description" name="description" className="w-full px-3 py-2 border rounded"></textarea>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Image du produit</label>
                                    <div {...getRootProps()} className="border p-6 cursor-pointer">
                                        {/* uploade et affichage des images  */}
                                        <input {...getInputProps()} />
                                        {/* affichage des images uploadées et les envoyer au serveur pour les stocker et les associer au produit pas en console.log mais en affichant les images dans la page */}
                                        {uploadedFiles.length > 0 ? (
                                            <div className="flex flex-wrap gap-4">
                                                {uploadedFiles.map((file, index) => (
                                                    <div key={`${file.name}-${index}`} className="w-24 h-24 relative">
                                                        {/* possible de retirer une image uploadée avant de soumettre le formulaire en cliquant sur une icone de suppression sur l'image */}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(file)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                                        >
                                                            ×
                                                        </button>

                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={file.name}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">Cliquez ou glissez-déposez des images ici pour les télécharger</p>
                                        )}

                                        <p>Upload une image</p>
                                    </div>
                                </div>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Ajouter le produit</button>
                                <button type="button" onClick={() => setIsAddingProduct(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">Annuler</button>
                            </form>
                        </div>
                    )}
                    {!isAddingProduct && (

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4">Mes produits</h2>
                            <p>Voici la liste de vos produits. Vous pouvez les modifier ou les supprimer.</p>
                            <ul className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                    {auth.produits && auth.produits.length > 0 ? (
                                        auth.produits.map((produit: any) => (
                                            <div key={produit.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">

                                                {/* 1. Zone Image / Carousel */}
                                                <div className="relative h-64 bg-gray-50 group">
                                                    {produit.image && produit.image.length > 0 && (
                                                        <div className="h-full w-full relative">
                                                            {produit.image.length === 1 ? (
                                                                <img
                                                                    src={`${url}/storage/${produit.image[0]}`}
                                                                    alt={produit.name}
                                                                    className="w-full h-full object-cover cursor-pointer"
                                                                    onClick={() => setSelectedImage(`${url}/storage/${produit.image[0]}`)}
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex justify-center items-center">
                                                                    <button
                                                                        onClick={() => prevImage(produit.image, produit.id)}
                                                                        className="absolute left-2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        ◀
                                                                    </button>
                                                                    <img
                                                                        src={`${url}/storage/${selectedImage || produit.image[activeImageIndexes[produit.id] || 0]}`}
                                                                        alt={produit.name}
                                                                        className="w-full h-full object-cover cursor-pointer"
                                                                        onClick={() => setSelectedImage(`${url}/storage/${produit.image[activeImageIndexes[produit.id] || 0]}`)}
                                                                    />
                                                                    <button
                                                                        onClick={() => nextImage(produit.image, produit.id)}
                                                                        className="absolute right-2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                                                    >
                                                                        ▶
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {/* Badge Prix */}
                                                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full font-bold shadow-sm text-sm">
                                                        {produit.price} €
                                                    </div>
                                                    <div className='absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full font-bold shadow-sm text-sm'>
                                                        {produit.stock_number > 0 ? `En stock (${produit.stock_number})` : 'En rupture de stock'}
                                                    </div>
                                                    <div>
                                                        {produit.status === 'inactif' && (
                                                            <div className='absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full font-bold shadow-sm text-sm'>
                                                                Inactif
                                                            </div>
                                                        )}
                                                        {
                                                            produit.status === 'actif' && (
                                                                <div className='absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full font-bold shadow-sm text-sm'>
                                                                    Actif
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>

                                                {/* 2. Infos du produit */}
                                                <div className="p-4 flex flex-col flex-grow">
                                                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{produit.name}</h3>
                                                    <p className=''>
                                                        Catégorie : {produit.category == '1' ? 'Tisane' : produit.category == '2' ? 'Miel' : 'N/A'}
                                                    </p>
                                                    <p>
                                                        {/* ici on va appliquer le nombre de stock et le type de stock pour afficher par exemple : "Pot de 250g (5 en stock)" ou "Sachet de 50g (Rupture de stock)" ou "Vrac au kg (10 en stock)" */}
                                                        Stock : {produit.stock && ` (${produit.stock_number > 0 ? `${produit.stock_number} ${produit.stock.replace('_', ' de  ')} en  stock ` : 'Rupture de stock'})`}
                                                    </p>

                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow cursor-help" title={produit.description}>
                                                        {produit.description.substring(0, 100)}
                                                        {produit.description.length > 100 ? '...' : ''}
                                                    </p>

                                                    {/* 3. Boutons d'action */}
                                                    <div className="flex gap-2 border-t pt-4">
                                                        <button
                                                            className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                                                            onClick={() => { setDataGet(produit); }}
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-all"
                                                            onClick={() => confirm('Vous voulez vraiment supprimer cette produit ? \n Action irreversible!') ? handleSuppression(produit.id) : false}
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </div>

                                                {selectedImage && (
                                                    <Modal onClose={closeModal}>
                                                        <div className='max-w-4xl max-h-[80vh] overflow-hidden'>
                                                            <img src={selectedImage} className="w-full h-full object-contain" />
                                                        </div>
                                                    </Modal>
                                                )}

                                                {dataget && dataget.id === produit.id && (
                                                    <Modal onClose={closeModal}>
                                                        <div className='w-100 p-6 max-w-4xl max-h-[80vh]  hover:overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-hidden'>
                                                            <h1 className=' text-xl font-bold mb-6'>Modification du produit</h1>
                                                            <form onSubmit={handleUpdate}>
                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                                                                        <input type="text" className='border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none' value={modfiName} onChange={(e) => setModfiName(e.target.value)} />
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">Catégorie</label>
                                                                        <select onChange={(e) => setModfiCategory(e.target.value)} value={modfiCategory} id="category" name="category" className="w-full px-3 py-2 border rounded">
                                                                            <option value="">-- Sélectionnez une catégorie --</option>
                                                                            <option value="1">Tisane</option>
                                                                            <option value="2">Miel</option>
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="stock_number" className="block text-gray-700 font-bold mb-2">Quantité en stock</label>
                                                                        <input value={modfiStockNumber} type="number" onChange={(e) => setModfiStockNumber(parseInt(e.target.value) || 0)} id="stock_number" name="stock_number" className="w-full px-3 py-2 border rounded" />
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">Stock</label>

                                                                        <select onChange={(e) => setModfiStock(e.target.value)} value={modfiStock} id="stock" name="stock" className="w-full px-3 py-2 border rounded">
                                                                            <option value="">-- Sélectionnez d'abord une catégorie --</option>
                                                                            {modfiCategory == '2' && (
                                                                                <>
                                                                                    <option value="pot_125g" selected={dataget.stock === 'pot_125g'}>Pot de 125g</option>
                                                                                    <option value="pot_250g" selected={dataget.stock === 'pot_250g'}>Pot de 250g</option>
                                                                                    <option value="pot_400g" selected={dataget.stock === 'pot_400g'}>Pot de 400g</option>
                                                                                    <option value="pot_500g" selected={dataget.stock === 'pot_500g'}>Pot de 500g</option>
                                                                                    <option value="pot_1kg" selected={dataget.stock === 'pot_1kg'}>Pot de 1kg</option>
                                                                                    <option value="seau_5kg" selected={dataget.stock === 'seau_5kg'}>Seau de 5kg</option>
                                                                                    <option value="litre" selected={dataget.stock === 'litre'}>Litre (Vrac)</option>
                                                                                    <option value="kg" selected={dataget.stock === 'kg'}>Kilo (Vrac)</option>
                                                                                </>
                                                                            )}
                                                                            {modfiCategory == '1' && (
                                                                                <>
                                                                                    <option value="sachet_30g" selected={dataget.stock === 'sachet_30g'}>Sachet de 30g</option>
                                                                                    <option value="sachet_50g" selected={dataget.stock === 'sachet_50g'}>Sachet de 50g</option>
                                                                                    <option value="sachet_100g" selected={dataget.stock === 'sachet_100g'}>Sachet de 100g</option>
                                                                                    <option value="boite_20_infusettes" selected={dataget.stock === 'boite_20_infusettes'}>Boîte de 20 infusettes</option>
                                                                                    <option value="vrac_kg" selected={dataget.stock === 'vrac_kg'}>Vrac (au kg)</option>
                                                                                    <option value="sachet_individuel" selected={dataget.stock === 'sachet_individuel'}>Sachet individuel</option>
                                                                                </>
                                                                            )}
                                                                        </select>
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                                        <textarea value={modfiDescription} onChange={(e) => setModfiDescription(e.target.value)} className='border rounded-lg p-2.5 w-full h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none' />
                                                                    </div>
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                                                                        <input type="number" className='border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none' value={modfiPrice} onChange={(e) => setModfiPrice(parseFloat(e.target.value))} />
                                                                    </div>

                                                                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-6 rounded-xl hover:bg-blue-50 transition-colors text-center cursor-pointer">
                                                                        <input {...getInputProps()} />
                                                                        {dataget.image && dataget.image.length > 0 ? (
                                                                            <div className="flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
                                                                                {dataget.image.map((file, index) => (
                                                                                    <div key={index} className="w-20 h-20 relative group">
                                                                                        <button type="button" onClick={() => removeFile(file)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-20 shadow-lg">×</button>
                                                                                        <img
                                                                                            src={file instanceof File || file instanceof Blob ? URL.createObjectURL(file) : `${url}/storage/${file}`}
                                                                                            className="w-full h-full object-cover rounded-md border"
                                                                                        />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-gray-500 text-sm">Ajoutez des images ici</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <button className="mt-6 w-50 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md">
                                                                    Modifier
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </Modal>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center flex flex-col items-center">
                                            <FileQuestionIcon className="text-gray-300 mb-4" size={64} />
                                            <p className="text-gray-500 text-lg">Vous n'avez pas encore de produits.</p>
                                        </div>
                                    )}
                                </div>
                            </ul>
                        </div>)
                    }

                </main>
            </div>
        </AppLayout>
    );
}
