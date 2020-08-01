import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: any

  constructor(public loadingController: LoadingController) { }

  async showLoader() {
    this.loading = await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
      backdropDismiss: true
    })

    await this.loading.present()

  }

  hideLoader() {
    if(this.loading)
      this.loading.dismiss()
  }
}
