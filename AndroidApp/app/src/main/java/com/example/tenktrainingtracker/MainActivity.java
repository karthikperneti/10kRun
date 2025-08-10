package com.example.tenktrainingtracker;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

/**
 * MainActivity hosts a WebView that loads the static 10K Training Tracker
 * site from the app's assets folder. This approach transforms the existing
 * HTML/CSS/JS application into a native Android experience while reusing
 * all functionality. JavaScript is enabled and links open within the
 * WebView itself.
 */
public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Create a WebView and set it as the activity's content view
        webView = new WebView(this);
        setContentView(webView);

        // Configure the WebView settings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        // Enable zoom controls if desired
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);

        // Ensure links open within the same WebView instead of an external browser
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        // Load the local HTML file from the assets folder
        webView.loadUrl("file:///android_asset/webapp/index.html");
    }

    @Override
    public void onBackPressed() {
        // Allow users to navigate back within the WebView history
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}