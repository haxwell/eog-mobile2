Releasing a version of Easyah for testing
-----

Be sure 
- you have deployed to the phone and done basic testing BEFORE building this APK. If not, and it breaks, as its want to do, you'll just have to do it anyway, so...
- all changes you want in this version are committed in both the API and the Client.
- versions have been upped from the last time you did this.. (see #6)

0.
cp src/_environments/environment.prod.ts src/_environments/environment.ts

1.
ionic cordova build --release android

2.
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore easyah-release-key.keystore /home/jjames/src/learning_ionic/eog-mobile.new/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name

** The easyah-release-key.keystore file is stored outside of the git repo.
** Note Password for keystore is the one you've used for a long time in Keepass.

3.
rm easyah.apk --force && zipalign -v 4 /home/jjames/src/learning_ionic/eog-mobile.new/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk easyah.apk

** this removes the easyah.apk built the last time this was run (it may not exist... thats okay) and then runs zipalign, an android apk tool.

4.
Issue the new release on Google Play.

5.
git tag -a vZ.Y.X -m "vZ.Y.X .... ..... "
git push --tags

6.
change config.xml and package.json to have the next version number. So when this step is done, config.xml and package.json will have a version number higher than what you see from `git tag` #definitionOfDone

7.
#tag the API, too.
git tag -a vZ.Y.X -m "vZ.Y.X .... ..... "
git push --tags

--
Building and releasing an IOS version
---

If you're reading this, we'll assume you just pulled a clean clone. Be sure you are on the correct branch (develop, some-feature-branch, etc)

Create the environment.ts file: cp src/_environments/environment.staging.ts src/_environments/environment.ts

Run 'npm install'
Run 'ionic cordova build ios --release'

(You may get an error about GoogleToolboxForMac not being found, etc. Go to the i`./platforms/ios` dir and run `pod install`. The run `ionic cordova build ios --release` again.)

(expect errors.. EXPORT FAILED, '..archive not found at path..', etc. Don't you worry. Continue on.)

cp ./resources/ios/icon/AppIcon* ./platforms/ios/Easyah/Images.xcassets/AppIcon.appiconset/
cp ./resources/ios/icon/icon-20.png ./platforms/ios/Easyah/Images.xcassets/AppIcon.appiconset/

Open the project in XCode: open ./platforms/ios/Easyah.xcworkspace/

In the Project Navigator, click on the Easyah entry, and then the Easyah entry to the right a bit under Targets.

The setting for General > Signing, select the Team (TODO: add clarifying detail about how certificates, and Apple IDs, etc relate to the value you choose here.) For me, the value is only one, Johnathan James.

The setting for Build Settings > Code Signing Identity should read `iOS Developer`. The Release setting below it should also read `iOS Developer`. The Development Team should read Johnathan James.

Set the Build number appropriately. If in doubt, choose 1.

Set the Deployment Target to 11.0.

In the window header, there is a Play, Stop, and Active Scheme button. Set the Active Scheme appropriately. If in doubt, choose Iphone 8.

Command-B, to build the project.

Look at the list of warnings etc that are generated. If there are any saying Update To Recommended Settings, go ahead and update.

Set your scheme to Generic IOS Device

In Project Settings, set Signing (Debug) and Signing (Release) to your provisioning profile. I believe its correct when the line 'Signing Certificate' reads 'iPhone Developer: ....'

Also under Targets > Easyah > Build Settings you will need to set Provisioning Profile to 'Easyah iOS Provisioning Profile' for the Release config. If there are columns to the right, set it in those as well. Set ALL of them.

Go to Product > Archive

The archive should build and you should see it in the Organizer window.

(The remaining part needs to be verified - 20181119184703)

You will get an email, telling you the build has completed processing, and that you can use it for TestFlight, or submit to the Apple Store.

You will need to go to appstoreconnect.apple.com to finish the release.

Under My Apps, choose the "plus-sign-in-the-circle version or platform". Enter the new version number. 

It will copy all the stuff from the previous version (though it may at first glance appear not to) Select the new build, and update whatever's necessary.

Save, and Submit For Review.
For
