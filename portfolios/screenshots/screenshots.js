async function getSiteScreenshots(urls) {
    const endpointBase = "https://www.site-shot.com/screenshot/";
    const screenshotData = [];
  
    for (const url of urls) {
      const endpointUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`${endpointBase}?width=1280&height=768&zoom=100&scaled_width=1280&full_size=&format=PNG&user_agent=&rnd=${Date.now()}&url=${url}&g-recaptcha-response=03AFY_a8VYQ_Y87fmwQX4VNDp9splYxLGUsdE-bDMZgf8L7kpdWmqKuH4EmC0dR7yku7j80rDP1jwRywwH2T-Ty7ooLWcFAK9h_ESDJ2HCKOmhetZgVjluZU405KjqtgV3WA_T3iQkrUipH7OhrUmp8hWQRJ3XNUg3cBfpdZ5jHt5ZT2ZA9MzQTvHT7ZJxZUjwvaHhNSa_agPQdNzc-1wcIx3wn4v-2KYeVZK6S9FQbmQlLmv61uPaGgFa60gK7Z-b9Bqy7dd3qCjLzWmZzEr0vmq5za-ocfFGWMn8XPRCOI2AmCPM5Ql6E_Bw98uLTll0Ap7rQ2U-XO6IdqSWghw-Q7MrE9LroXXfw3_IbnR4ESh90GXmiPCRtOSOeoyxHXGoLe_W2EXKvL7rz7Vl44CFkmstyDQg88R8i1FqQJcIvfFJIaB2YVkabEm10qOMVl-eN-D50F9ufugKNcv2hSnPpzBrPIodBnfv3c29gnjvIjVM8PRgpliGjFjrN7llgfBZVfF5rCqCdjdMzzzGeuHCjN_wMKk4iU_hazIT7xSBR9vnRN07CsxjVYeGDkZXOmLEOQibctDCGRbu&proxy_rotation=1`)}`;
  
      // const response = await fetch(endpointUrl);

      fetch(endpointUrl)
                    .then(response => {
                      if (response.ok) return response.json()
                      throw new Error('Network response was not ok.')
                    })
                    .then(data => {
                      console.log(data.contents)
                    });
  
      // if (!response.ok) {
      //   console.log(`Error fetching screenshot for ${url}: ${response.status}`);
      //   continue;
      // }
  
      // const json = await response.json();
      // const imageData = json.image;
      // screenshotData += {"url":url, "image": imageData};
    }
  
    return screenshotData;
}


const screenshots = getSiteScreenshots(["microsoft.com"]);
console.log(screenshots);



// https://www.site-shot.com/screenshot/?width=1280&height=768&zoom=100&scaled_width=1280&full_size=&format=PNG&user_agent=&rnd=194421692735595&url=apple.com&g-recaptcha-response=03AFY_a8Wrt3ZIZZC6UQF0G8Zcr0CAhgBdFEno13lD3S7tTPTW6Jh6PS-6cQMyOZD_-c5ACl6hja0tQ5X5SaZFiJHsMt2hErFsJ8xH8PO-ED8xRTghiFlAOLb4-IhLOdvICjH-w8760mz5AuFQ9hk2A-fVz2TfSbnXF2p00sn7y3vBTvKl6BvLRaHQMnj9AoToNhxIKVlVuYnfpCLlNzxQ2-JJ5pMr6xK3BckGFVm_hP3yQox2NE_5GK041vt0cwGSOm-R_gTYIQW08yqOzzmZOGHcDV6yekBvRFOBAiO0BhERo0brtmQCNRA6-6G4Hux6wCvxFqQAxMVLMlxpBTx6CuCFmPxMbI95o8DEP_qB3P7IG18JbS38DIKpZ5hKFmVX7xL2aOI-_Ptu6ZFUfLWjMooAoZ8DHn0vHRtmM5JctzanyFTCYJWT1upWZ-JiXypgepoMiL113J7Evn3LxqMciHo5WN9-mOCeaJeUdpPZNamxnzOYHFbTmS9m_UWfOolCX37DEYoz1xp4ABCi4CuXVCNTMv4JwZM2EbMKGiLm9P-D0g8DXeJOWD4&proxy_rotation=1
// https://www.site-shot.com/screenshot/?width=1280&height=768&zoom=100&scaled_width=1280&full_size=&format=PNG&user_agent=&rnd=227765228409417&url=apple.com&g-recaptcha-response=03AFY_a8VJvUSxQt318N29VXiR3FYv0Z12CH57i4H_m2_uzU8Rm3FLJxDb1rarP_bckzzX_BQuDo1mmvJ1C2i4OfZ30U61RaaDIm-5pyOhsBrFvFOk-ZHkSLm0rBt6Z2j4ZVRuCyxws8MBbAXkGdZX60eK4h_OB69FphtQ_DQc4Z_bRi6otwVRnWH-iC4kz7xarAmev2A-NL0Tbk5xXOPxXWVOOig8H8vpFR9BEM7QEvOQmGG19fJaj5wL7EsMVHJQTRv3m3_xXEbEO47GZZ1w4FI7dCtiE9Nsu_ncDQ5WCtYLfGtB_IbnI2pzEtkEoYQGW0awx8ysLKB58KiPRtKys-yHzSvJaLeQAGfwLsNHFZaR5NdOpybzhOmyIuNMZe3sny_REP_lQ0Rcu5blK3_c7mlgHlqdLGpyQb5fIdBESucWvkcvG9hwUhGHHAQf8Tty5lcTvar62TSc9vJxHbqdaKGZmLTSuvRnde0E_yuxVBQKjMlzYwd121P1Lsb7dVlZTWgkQ0cDHpUKftrf2g-UGRUD_LtpQ_qgn8ReNaFMpJpbRoGzmDxGXiw&proxy_rotation=1



// 03AFY_a8W0f-lkvbZhVrwCuyYUIjjU5ic9_QlybaTLeMJVquPevlnEZgdsppWu70t3zPU5uCfGjfvcdQNxVBLLqvpEkG0HcDR7LXURtUDMkS11s9qMegO7ni0aJP4IPwXR4Gx7U9T6aghbBMNBgRrML3PeBY-X80WePtAYJWrHr_wWAOdEWKD-au5kWxMYK1A8vY3n7ZV0d5pzloqmrDAQ5DjESjFJ4EN7UMvAiuXScZlBs4ULLfMr8OISWHqJrdU4sleu_B0958ocU7hM3k5OjeiOrFq7dTUvcOcUOtXrixptSn90308vrigi5XtM0VXRfB9JlcyhRE631aK97pI0k2mCL8VI0NgUXn6_YJk6Rq8TaPZA1iIrrakxGqMFN0H2BJzy5NqHbvWQ8f2efiPLALACwljyl_-9AGpQqvTUDC01i37BEpW1LSz2ZTSPboimV2aHr_eCvOX92z2aEtPgiTU5tv6JnS8vfVEdF_8GfHhhNjDQJ0vSb06siunSzDf0YKs8mIsiyoIAYrSV9a0ifyyvMidZ2UV1_YH3rguW0K2m3Ssl7A5U4sYgjwuE5K3RgKDcoPtXF4jW&proxy_rotation=1
