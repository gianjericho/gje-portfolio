# JO_APP - Technician Dispatch Mobile App

JO_APP is a Flutter-based mobile application designed for field technicians in a telecom company. It allows technicians to view their assigned installation requests, see client details, locate client addresses on Google Maps, and view nearby NAP (Network Access Point) boxes with their available port status.

This app is the technician-facing companion to the customer-facing installation request web/system.

## Features

- View list of assigned installation jobs with client information (name, address, contact, email, preferred date)
- Interactive Google Maps view for each client's exact location (pinned marker)
- Separate full-screen map showing all nearby NAP boxes with port availability info (e.g., 5/10 ports available)
- Clean, simple UI with bottom navigation (Assignments + NAP Map)
- HTTP integration with backend API for real-time data
- Form validation and error handling on the client side (inherited from companion app)

## Screenshots

**Login Screen**  
Simple authentication screen for technicians.

<img src="screenshots/Login_Screen.jpg" width="400" alt="Login Screen">

**Technician Assignments / Dispatch**  
List of assigned jobs with client name, address, contact, preferred date/time.

<img src="screenshots/Technician_Dispatch.jpg" width="400" alt="Technician Assignments">

**Client Location Map**  
Interactive Google Map showing exact client location with marker.

<img src="screenshots/Technician_Map.jpg" width="400" alt="Client Location Map">

**Nearby NAP Boxes Map**  
Full-screen map displaying all  Network Access Points with port availability.

Technician Map shows the jobs they have been assigned to.

<img src="screenshots/Technician_Map.jpg" width="400" alt="NAP Boxes Map (Technician view)">

Admin Map shows all jobs that have been assigned.

<img src="screenshots/Admin_Map.jpg" width="400" alt="NAP Boxes Map (Admin view)">

**Admin Dispatch View** (included for completeness – shows overall dispatch interface)

<img src="screenshots/Admin_Dispatch.jpg" width="400" alt="Admin Dispatch">

## Tech Stack

- **Framework**: Flutter (Dart)
- **State Management**: setState (simple, can be upgraded to Provider/Riverpod later)
- **Networking**: http package
- **Maps**: google_maps_flutter
- **Backend**: REST API (assumed endpoint: `https://telecom-install-backend.onrender.com`)
- **Minimum SDK**: Android API 20+ (minSdk 20)

## Prerequisites

- Flutter SDK (3.0+ recommended)
- Android Studio (with Flutter & Dart plugins)
- Google Maps API Key (with Maps SDK for Android enabled)
- Backend API access (or mock server for development)

## ⚙️ Local Development Setup

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gianjericho/jo_app.git
   cd jo_app

2. **Install dependencies**
    ```bash
    flutter pub get

3. **Configure Google Maps API Key**
    Open `android/app/src/main/AndroidManifest.xml` and add/replace your key:
    ```xml
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="YOUR_ACTUAL_GOOGLE_MAPS_API_KEY_HERE"/>

4. **Update backend URLs (if needed)**
    The app currently uses:
    - Assignments: `https://telecom-install-backend.onrender.com/api/technician/assignments`
    - NAP Boxes: `https://telecom-install-backend.onrender.com/api/nap_boxes`
    Change these in `lib/main.dart` if your backend is different.

5. **Run the app**
    ```bash
    # List devices
    flutter devices

# Run on connected Android device/emulator
    flutter run

## Project Structure
    jo_app/
    ├── android/                # Android-specific files
    ├── ios/                    # iOS-specific files (not used yet)
    ├── lib/
    │   └── main.dart           # Main app entry + all screens
    ├── pubspec.yaml            # Dependencies & assets
    ├── analysis_options.yaml   # Linter rules
    └── README.md

## Planned / Possible Improvements

- User authentication / login for technicians
- Real-time updates (WebSocket or polling)
- Technician location tracking (`myLocationEnabled: true`)
- NAP box filtering (show only available ports, search by name)
- Offline support / caching
- Job status update (accept, complete, report issue)
- Photo upload for installation proof
- Notifications

## Contributing

Contributions are welcome!  
Please open an issue first to discuss changes.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## Contact / Support

For questions or issues:  
- GitHub Issues: https://github.com/gianjericho/jo_app/issues  
- Developer: Gian Jericho

---
Made with Flutter for faster telecom installations 🚀