import { Component, OnInit } from '@angular/core';
import { deleteObject, percentage, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getDownloadURL } from 'firebase/storage';
import { ICategoryResponse } from 'src/app/shared/interfaces/discount/category/category.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  public categoryForm!: FormGroup;
  public editStatus = false;
  public adminCategories: Array<ICategoryResponse> = [];
  private currentCategoryId = 0;
  public isUploaded = false;
  public uploadPercent!: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategories();
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: ['https://la.ua/wp-content/uploads/2021/06/menu-icon-2.svg', Validators.required]
    })
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.adminCategories = data;
    })
  }


  addCategory(): void {
    if (this.editStatus) {
      this.categoryService.update(this.categoryForm.value, this.currentCategoryId).subscribe(() => {
        this.loadCategories();
      })
    } else {
      this.categoryService.create(this.categoryForm.value).subscribe(() => {
        this.loadCategories();
      })
    }
    this.editStatus = false;
    this.categoryForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    })
    this.editStatus = true;
    this.currentCategoryId = category.id;
    this.isUploaded = true;
  }

  deleteCategory(category: ICategoryResponse): void {
    this.categoryService.delete(category.id).subscribe(() => {
      this.loadCategories();
    })
  }
  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('images', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }
  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storegeRef = ref(this.storage, path);
        const task = uploadBytesResumable(storegeRef, file);
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress
        });
        await task;
        url = await getDownloadURL(storegeRef);
      } catch (e: any) {
        console.log(e);
      }
    } else {
      console.log('wrong format');
    }
    return Promise.resolve(url);
  }

  deleteImage(): void {
    const task = ref(this.storage, this.valueByControl('imagePath'));
    deleteObject(task).then(() => {
      console.log('file deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.categoryForm.patchValue({
        imagePath: null
      })

    })
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }
}
