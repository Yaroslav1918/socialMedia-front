import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Observable } from "rxjs";
import { setup, track, printSubscribers } from "observable-profiler";

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
setup(Observable); // Set up the profiler for RxJS Observables.
declare global {
  interface Window {
    stopProfiler: () => void;
  }
}
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((ref) => {
    track(); // Start tracking subscriptions.

    // Expose a function in the window object to stop profiling.
    window.stopProfiler = () => {
      ref.destroy(); // Destroy the Angular module instance.
      const subscribers = track(false); // Stop tracking and get the subscribers.
      printSubscribers({ subscribers }); // Print the subscribers to the console.
    };
  })
  .catch((err) => console.error(err));
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
