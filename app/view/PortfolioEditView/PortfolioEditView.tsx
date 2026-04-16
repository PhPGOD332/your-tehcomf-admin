import React, {useContext, useEffect, useState} from 'react';
import styles from './PortfolioEditView.module.scss';
import type {IWork} from "~/types/IWork";
import SubTitle from "~/shared/UI/SubTitle/SubTitle";
import GreenButton, {ButtonType} from "~/shared/UI/GreenButton/GreenButton";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import TextInput, {InputType} from "~/shared/UI/TextInput/TextInput";
import type {TFormPortfolioInputs} from "~/types/TFormInputs";
import LexkitEditor from "~/shared/UI/LexkitEditor/LexkitEditor";
import Select from "~/shared/UI/Select/Select";
import {Context} from "~/root";
import type {IFilterType} from "~/types/PortfolioFilters/IFilterType";
import type {IFilterColor} from "~/types/PortfolioFilters/IFilterColor";
import type {IColor} from "~/types/IColor";
import type {IFilterLayout} from "~/types/PortfolioFilters/IFilterLayout";
import type {IFilterStyle} from "~/types/PortfolioFilters/IFilterStyle";
import type {IBlobImage, IImage} from "~/types/IImage";
import {dropOrChangeHandler} from "~/shared/utils/dropOrChangeHandler";
import NumInput from "~/shared/UI/NumInput/NumInput";
import SuccessMessage from "~/shared/UI/SuccessMessage/SuccessMessage";

interface ViewProps {
    title: string;
    work: IWork;
    types: IFilterType[];
    filterColors: IFilterColor[];
    colors: IColor[];
    layouts: IFilterLayout[];
    filterStyles: IFilterStyle[];
}

const PortfolioEditView = (
    {
        title,
        work,
        types,
        filterColors,
        colors,
        layouts,
        filterStyles
    }: ViewProps
) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<TFormPortfolioInputs>({ mode: 'onChange', reValidateMode: 'onChange' });
    const { rootStore } = useContext(Context);
    const [editorText, setEditorText] = useState<string>(work.description ?? '');
    const [currWork, setCurrWork] = useState<IWork>(work);
    const [photos, setPhotos] = useState<IImage[]>(work.images);
    const [newPhotos, setNewPhotos] = useState<IBlobImage[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [editorNewFiles, setEditorNewFiles] = useState<File[]>([]);
    const [drag, setDrag] = useState<boolean>(false);
    const [statusNotes, setStatusNotes] = useState<React.ReactNode[]>([]);

    const changeTypeHandler = (typeName: string) => {
        setCurrWork({...work, type: rootStore.types.find(type => type.name === typeName)});
    }

    const changeColorHandler = (colorName: string) => {
        setCurrWork({...work, color: rootStore.filterColors.find(filterColor => filterColor.name === colorName)});
    }

    const changeBodyColorHandler = (colorName: string) => {
        setCurrWork({...work, bodyColor: rootStore.colors.find(color => color.name === colorName)});
    }

    const changeTableTopColorHandler = (colorName: string) => {
        setCurrWork({...work, tableTopColor: rootStore.colors.find(color => color.name === colorName)});
    }

    const changeLayoutHandler = (layoutName: string) => {
        setCurrWork({...work, layout: rootStore.layouts.find(layout => layout.name === layoutName)});
    }

    const changeStyleHandler = (styleName: string) => {
        setCurrWork({...work, style: rootStore.styles.find(style => style.name === styleName)});
    }

    const deleteImageHandler = (photoSrc: string) => {
        const images = [...photos];

        const newPhotos = images.filter(image => image.src !== photoSrc);
        setPhotos(newPhotos);
    }

    useEffect(() => {
        console.log(photos);
    }, [photos]);

    const deleteNewImageHandler = (photoTitle: string) => {
        const images = [...newPhotos];

        const result = images.filter(image => image.title !== photoTitle);
        const newFiles = files.filter(file => file.name !== photoTitle);

        setFiles(newFiles);
        setNewPhotos(result);
    }

    // Обработчик фото
    const getPhotosFromFiles = (event: any, files: any[]) => {
        const photos: any[] = [];

        files.map((file) => {
            let photo = {
                title: file.name,
                src: URL.createObjectURL(file),
            };

            photos.push(photo);
        });

        setNewPhotos(photos);
    };

    const setEditorNewFileHandler = (file: File) => {
        if (!file) return;

        setEditorNewFiles([...editorNewFiles, file]);
    }

    const setEditorDeleteFileHandler = (title: string) => {
        if (!title) return;

        const newFiles = editorNewFiles.filter(currFile => currFile.name !== title);

        setEditorNewFiles(newFiles);
    }

    // Обработчики
    const dragStartHandler = (event: any) => {
        event.preventDefault();
        setDrag(true);
    };
    const dragLeaveHandler = (event: any) => {
        event.preventDefault();
        setDrag(false);
    };
    const dropHandler = (event: any) => {
        event.preventDefault();
        setDrag(false);
        let files = [...event.dataTransfer.files];
        setFiles(files);

        if (files && files.length > 0) {
            getPhotosFromFiles(event, files);
        }
    };

    const submitHandler = async (data: IWork) => {

        if (!photos && !newPhotos.length) {
            setError("images", {
                message: "Добавьте хотя бы одну фотографию"
            })
            return;
        }

        const updateWork = data;
        updateWork.id = currWork.id;
        updateWork.type = currWork.type;
        updateWork.color = currWork.color;
        updateWork.bodyColor = currWork.bodyColor;
        updateWork.tableTopColor = currWork.tableTopColor;
        updateWork.layout = currWork.layout;
        updateWork.style = currWork.style;
        updateWork.description = editorText;
        updateWork.images = photos;

        const work = await rootStore.updateWork(updateWork, files, editorNewFiles)

        if (work) {
            setStatusNotes([...statusNotes, <SuccessMessage message={'Работа успешно сохранена'} key={statusNotes.length} />]);
            deleteStatusNote();
            setCurrWork(work);
            setFiles([]);
            setNewPhotos([]);
            setPhotos(work.images);
            setEditorText(work.description);
            setEditorNewFiles([]);
        } else {
            setStatusNotes([...statusNotes, <SuccessMessage message={'При сохранении произошла ошибка'} key={statusNotes.length} />]);
            deleteStatusNote();
        }
    }

    const deleteStatusNote = () => {
        if (statusNotes.length > 0) {
            setTimeout(() => {
                const reversedStatusNotes = statusNotes;
                reversedStatusNotes.shift();
                setStatusNotes(reversedStatusNotes);
            }, 3000);
        }
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrWork({...work, description: editorText});
        }, 1000);

        return clearTimeout(timeout);
    }, [editorText]);

    return (
        <>
            <div className={styles.portfolioView}>
                <div className={'container'}>
                    <div className={styles.titleBlock}>
                        <SubTitle classNames={styles.title}>{title}</SubTitle>
                        <GreenButton
                            classNames={styles.actionButton}
                            type={ButtonType.SUBMIT}
                            onClick={handleSubmit(submitHandler)}
                        >Сохранить</GreenButton>
                    </div>
                    <div className={styles.formWrapper}>
                        <form onSubmit={handleSubmit(submitHandler)} className={styles.form}>
                            <TextInput
                                classNames={styles.formInput}
                                label={'Наименование на английском (в качестве разрыва между словами использовать только "_", например, "white_kitchen")'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: 'Заполните это поле!'
                                    },
                                    value: currWork.name ?? '',
                                })}
                                error={errors.name}
                                disabled={!!currWork.name}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Заголовок'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("title", {
                                    required: {
                                        value: true,
                                        message: 'Заполните это поле!'
                                    },
                                    value: currWork.title ?? '',
                                })}
                                error={errors.title}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Подзаголовок'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("subtitle", {
                                    value: currWork.subtitle ?? '',
                                })}
                                error={errors.subtitle}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Размеры комнаты'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("sizesRoom", {
                                    value: currWork.sizesRoom ?? '',
                                })}
                                error={errors.sizesRoom}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Размеры мебели'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("sizesFurniture", {
                                    value: currWork.sizesFurniture ?? '',
                                })}
                                error={errors.sizesFurniture}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Материал корпуса'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("housingMaterial", {
                                    value: currWork.housingMaterial ?? '',
                                })}
                                error={errors.housingMaterial}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Материал фасада'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("facadeMaterial", {
                                    value: currWork.facadeMaterial ?? '',
                                })}
                                error={errors.facadeMaterial}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Материал столешницы'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("tableTopMaterial", {
                                    value: currWork.tableTopMaterial ?? '',
                                })}
                                error={errors.tableTopMaterial}
                            />
                            <TextInput
                                classNames={styles.formInput}
                                label={'Мебельные аксессуары'}
                                type={InputType.TEXT}
                                isPlaceholderError={true}
                                {...register("furnitureAccessories", {
                                    value: currWork.furnitureAccessories ?? '',
                                })}
                                error={errors.furnitureAccessories}
                            />
                            <NumInput
                                type={InputType.NUMBER}
                                classNames={`${styles.formInput} ${styles.priceInput}`}
                                label={'Цена'}
                                {...register("price", {
                                    required: {
                                        value: true,
                                        message: 'Укажите цену'
                                    },
                                    value: currWork.price
                                })}
                                error={errors.price}
                            />
                            <Select
                                caption={'Тип'}
                                options={types}
                                initialOption={work.type}
                                changeHandle={changeTypeHandler}
                                label={'Тип'}
                            />
                            <Select
                                caption={'Палитра'}
                                options={filterColors}
                                initialOption={work.color}
                                changeHandle={changeColorHandler}
                                label={'Палитра'}
                            />
                            <Select
                                caption={'Цвет корпуса'}
                                options={colors}
                                initialOption={work.bodyColor}
                                changeHandle={changeBodyColorHandler}
                                label={'Цвет корпуса'}
                            />
                            <Select
                                caption={'Цвет столешницы'}
                                options={colors}
                                initialOption={work.tableTopColor}
                                changeHandle={changeTableTopColorHandler}
                                label={'Цвет столешницы'}
                            />
                            <Select
                                caption={'Планировка'}
                                options={layouts}
                                initialOption={work.layout}
                                changeHandle={changeLayoutHandler}
                                label={'Планировка'}
                            />
                            <Select
                                caption={'Стиль'}
                                options={filterStyles}
                                initialOption={work.style}
                                changeHandle={changeStyleHandler}
                                label={'Стиль'}
                            />
                            <div className={styles.photosBlock}>
                                <div className={styles.photosPreview}>
                                    <label className={styles.label}>Старые фото</label>
                                    {photos.length > 0 &&
									    <div className={styles.photos}>
                                            {photos.map((photo, num) =>
                                                <div className={styles.photo} key={num}>
                                                    <img
                                                        src={photo.src}
                                                        alt={`Фото ${num + 1}`}
                                                        className={styles.photoPreview}
                                                    />
                                                    <button
                                                        type={'button'}
                                                        className={styles.deleteButton}
                                                        onClick={() => {
                                                            deleteImageHandler(photo.src)
                                                        }}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 64 64" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <g clipPath="url(#clip0_5058_2390)">
                                                                <path
                                                                    d="M41.3776 32.005L62.0532 11.3347C64.6489 8.73827 64.6489 4.54874 62.0532 1.95234C59.4574 -0.644058 55.2688 -0.644058 52.673 1.95234L31.9975 22.6227L11.327 1.9473C8.73117 -0.6491 4.54263 -0.6491 1.94684 1.9473C-0.648947 4.5437 -0.648947 8.73323 1.94684 11.3296L22.6224 32L1.94684 52.6704C-0.648947 55.2668 -0.648947 59.4563 1.94684 62.0527C4.54767 64.6491 8.75133 64.6491 11.327 62.0527L32.0025 41.3823L52.6781 62.0527C55.2739 64.6491 59.4624 64.6491 62.0582 62.0527C64.6338 59.4563 64.6338 55.2668 62.033 52.6653L41.3776 32.005Z"
                                                                    fill="#00A651"/>
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_5058_2390">
                                                                    <rect width="64" height="64" fill="white"/>
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </button>
                                                    <p className={styles.previewTitle}>{photo.src}</p>
                                                </div>
                                            )}
									    </div>
                                    }
                                </div>
                                <div className={styles.photosLoader}>
                                    <label htmlFor="" className={styles.inputLabel}>
                                        Фото
                                    </label>
                                    <label htmlFor="photos" className={styles.labelPhotos}>
                                        {!drag ? 'Добавить новые фото' : 'Отпустите изображения'}
                                    </label>
                                    <input
                                        id={'photos'}
                                        className={styles.photoInput}
                                        type="file"
                                        {...register("images", {
                                            value: photos
                                        })}
                                        multiple
                                        onChange={(e) => {
                                            dropOrChangeHandler(
                                                e,
                                                files,
                                                setDrag,
                                                setFiles,
                                                setNewPhotos
                                            )
                                        }}
                                        onDragStart={e => dragStartHandler(e)}
                                        onDragLeave={e => dragLeaveHandler(e)}
                                        onDragOver={e => dragStartHandler(e)}
                                        onDrop={e => dropHandler(e)}
                                    />
                                </div>
                                {newPhotos.length > 0 &&
								    <div className={styles.photosPreview}>
									    <label className={styles.label}>Новые фото</label>
									    <div className={styles.photos}>
                                            {newPhotos.map((photo, num) =>
                                                <div className={styles.photo} key={num}>
                                                    <img
                                                        src={photo.src}
                                                        alt={`Фото ${num + 1}`}
                                                        className={styles.photoPreview}
                                                    />
                                                    <button
                                                        type={'button'}
                                                        className={styles.deleteButton}
                                                        onClick={() => {
                                                            deleteNewImageHandler(photo.title)
                                                        }}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 64 64" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <g clipPath="url(#clip0_5058_2390)">
                                                                <path
                                                                    d="M41.3776 32.005L62.0532 11.3347C64.6489 8.73827 64.6489 4.54874 62.0532 1.95234C59.4574 -0.644058 55.2688 -0.644058 52.673 1.95234L31.9975 22.6227L11.327 1.9473C8.73117 -0.6491 4.54263 -0.6491 1.94684 1.9473C-0.648947 4.5437 -0.648947 8.73323 1.94684 11.3296L22.6224 32L1.94684 52.6704C-0.648947 55.2668 -0.648947 59.4563 1.94684 62.0527C4.54767 64.6491 8.75133 64.6491 11.327 62.0527L32.0025 41.3823L52.6781 62.0527C55.2739 64.6491 59.4624 64.6491 62.0582 62.0527C64.6338 59.4563 64.6338 55.2668 62.033 52.6653L41.3776 32.005Z"
                                                                    fill="#00A651"/>
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_5058_2390">
                                                                    <rect width="64" height="64" fill="white"/>
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </button>
                                                    <p className={styles.previewTitle}>{photo.src}</p>
                                                </div>
                                            )}
									    </div>
								    </div>
                                }
                                <span className={styles.error}>{errors.images && errors.images.message}</span>
                            </div>
                        </form>
                        <LexkitEditor
                            label={'Описание'}
                            value={editorText}
                            setValue={setEditorText}
                            setNewFileHandler={setEditorNewFileHandler}
                            setDeleteFileHandler={setEditorDeleteFileHandler}
                        />
                        {statusNotes}
                    </div>
                </div>
            </div>
        </>
    );
};

export default observer(PortfolioEditView);