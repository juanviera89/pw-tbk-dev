module.exports = {
  env: "development",
  db: {
    uri: "mongodb+srv://pwMaster:R0Xtt2CsgqM3azbqR1kH@pwdevelopment-5gy4a.mongodb.net/payw",
    options: {
      bufferCommands: false,
      autoIndex: false,
      poolSize: 10,
      socketTimeoutMS: 28000,
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  },
  hw: {
    url: ""
  },
  cognito: {
    secretAccessKey: "1",
    accessKeyId: "1",
    IdentityPoolId: "us-east-1",
    region: "us-east-1",
    apiVersion: "2016-04-18"
  },
  transbank: {
    webpay: {
      returnUrl: "https://2b6xq.sse.codesandbox.io/result",
      finalUrl: "https://2b6xq.sse.codesandbox.io/finish",
      config: {
        privateCert:
          "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAvuNgBxMAOBlNI7Fw5sHGY1p6DB6EMK83SL4b1ZILSJs/8/MC\nX8Pkys3CvJmSIiKU7fnWkgXchEdqXJV+tzgoED/y99tXgoMssi0ma+u9YtPvpT7B\na5rk5HpLuaFNeuE3l+mpkXDZZKFSZJ1fV/Hyn3A1Zz+7+X2qiGrAWWdjeGsIkz4r\nuuMFLQVdPVrdAxEWoDRybEUhraQJ1kwmx92HFfRlsbNAmEljG9ngx/+/JLA28cs9\noULy4/M7fVUzioKsBJmjRJd6s4rI2YIDpul6dmgloWgEfzfLNnAsZhJryJNBr2Wb\nE6DL5x/U2XQchjishMbDIPjmDgS0HLLMjRCMpQIDAQABAoIBAEkSwa/zliHjjaQc\nSRwNEeT2vcHl7LS2XnN6Uy1uuuMQi2rXnBEM7Ii2O9X28/odQuXWvk0n8UKyFAVd\nNSTuWmfeEyTO0rEjhfivUAYAOH+coiCf5WtL4FOWfWaSWRaxIJcG2+LRUGc1WlUp\n6VXBSR+/1LGxtEPN13phY0DWUz3FEfGBd4CCPLpzq7HyZWEHUvbaw89xZJSr/Zwh\nBDZZyTbuwSHc9X9LlQsbaDuW/EyOMmDvSxmSRJO10FRMxyg8qbE4edtUK4jd61i0\nkGFqdDu9sj5k8pDxOsN2F270SMlIwejZ1uunB87w9ezIcR9YLq9aa22cT8BZdOxb\nuZ3PAAECgYEA6xfgRtcvpJUBWBVNsxrSg6Ktx2848eQne9NnbWHdZuNjH8OyN7SW\nFn0r4HsTw59/NJ1L5F3co5L5baEtRbRLWRpD72xjrXsQSsoKliCik1xgDIplMvOh\nteA2GdeSv9wglqnotGcj5B/8+vn3tEzMjy+UUsyFn0fIaDC3zK3W2qUCgYEAz90g\nva+FCcU8cnykb5Yn1u1izdK1c6S++v1bQFf6590ZMNy3p0uGrwAk/MzuBkJ421GK\np4pInUvO/Mb2BCcoHtr3ON3v0DCLl6Ae2Gb7lG0dLgcZ1EK7MDpMvKCqNHAv8Qu8\nQBZOA08L8buVkkRt7jxJrPuOFDI5JAaWCmMOSgECgYEA3GvzfZgu9Go862B2DJL+\nhCuYMiCHTM01c/UfyT/z/Y7/ln2+8FniS02rQPtE6ar28tb0nDahM8EPGon/T5ae\n+vkUbzy6LKLxAJ501JPeurnm2Hs+LUqe+U8yioJD9p2m9Hx0UglOborLgGm0pRlI\nxou+zu8x7ci5D292NXNcun0CgYAVKV378bKJnBrbTPUwpwjHSMOWUK1IaK1IwCJa\nGprgoBHAd7f6wCWmC024ruRMntfO/C4xgFKEMQORmG/TXGkpOwGQOIgBme+cMCDz\nxwg1xCYEWZS3l1OXRVgqm/C4BfPbhmZT3/FxRMrigUZo7a6DYn/drH56b+KBWGpO\nBGegAQKBgGY7Ikdw288DShbEVi6BFjHKDej3hUfsTwncRhD4IAgALzaatuta7JFW\nNrGTVGeK/rE6utA/DPlP0H2EgkUAzt8x3N0MuVoBl/Ow7y5sqIQKfEI7h0aRdXH5\necefOL6iiJWQqX2+237NOd0fJ4E1+BCMu/+HnyCX+cFM2FgoE6tC\n-----END RSA PRIVATE KEY-----",
        publicCert:
          "-----BEGIN CERTIFICATE-----\nMIIDeDCCAmACCQDjtGVIe/aeCTANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJj\nbDENMAsGA1UECAwEc3RnbzENMAsGA1UEBwwEc3RnbzEMMAoGA1UECgwDdGJrMQ0w\nCwYDVQQLDARjY3JyMRUwEwYDVQQDDAw1OTcwMjAwMDA1NDAxHTAbBgkqhkiG9w0B\nCQEWDmNjcnJAZ21haWwuY29tMB4XDTE4MDYwODEzNDYwNloXDTIyMDYwNzEzNDYw\nNlowfjELMAkGA1UEBhMCY2wxDTALBgNVBAgMBHN0Z28xDTALBgNVBAcMBHN0Z28x\nDDAKBgNVBAoMA3RiazENMAsGA1UECwwEY2NycjEVMBMGA1UEAwwMNTk3MDIwMDAw\nNTQwMR0wGwYJKoZIhvcNAQkBFg5jY3JyQGdtYWlsLmNvbTCCASIwDQYJKoZIhvcN\nAQEBBQADggEPADCCAQoCggEBAL7jYAcTADgZTSOxcObBxmNaegwehDCvN0i+G9WS\nC0ibP/PzAl/D5MrNwryZkiIilO351pIF3IRHalyVfrc4KBA/8vfbV4KDLLItJmvr\nvWLT76U+wWua5OR6S7mhTXrhN5fpqZFw2WShUmSdX1fx8p9wNWc/u/l9qohqwFln\nY3hrCJM+K7rjBS0FXT1a3QMRFqA0cmxFIa2kCdZMJsfdhxX0ZbGzQJhJYxvZ4Mf/\nvySwNvHLPaFC8uPzO31VM4qCrASZo0SXerOKyNmCA6bpenZoJaFoBH83yzZwLGYS\na8iTQa9lmxOgy+cf1Nl0HIY4rITGwyD45g4EtByyzI0QjKUCAwEAATANBgkqhkiG\n9w0BAQsFAAOCAQEAhX2/fZ6+lyoY3jSU9QFmbL6ONoDS6wBU7izpjdihnWt7oIME\na51CNssla7ZnMSoBiWUPIegischx6rh8M1q5SjyWYTvnd3v+/rbGa6d40yZW3m+W\np/3Sb1e9FABJhZkAQU2KGMot/b/ncePKHvfSBzQCwbuXWPzrF+B/4ZxGMAkgxtmK\nWnWrkcr2qakpHzERn8irKBPhvlifW5sdMH4tz/4SLVwkek24Sp8CVmIIgQR3nyR9\n8hi1+Iz4O1FcIQtx17OvhWDXhfEsG0HWygc5KyTqCkVBClVsJPRvoCSTORvukcuW\n18gbYO3VlxwXnvzLk4aptC7/8Jq83XY8o0fn+A==\n-----END CERTIFICATE-----",
        commerceCode: 597020000540,
        commerceEmail: "",
        service: "normal",
        environment: "integration",
        wsdlUrl:
          "https://webpay3gint.transbank.cl/WSWebpayTransaction/cxf/WSWebpayService?wsdl"
      }
    },
    oneclick : {
      finalUrl: "https://2b6xq.sse.codesandbox.io/oneclick/result",
      config : {
        privateCert:
         '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA48S877GUtjlYrqIQDlZAMqg5kfNrrZlCZckC1LGzCfcPu7Lm\nza2c2F1Q7zKELqVTo1wuZUS1inhYmtg4PexDKak/uryARR3uy2kqq3yG3IQNIdQY\nRpAUl8SvNyJvUVtA0N6nwjaqsTv1EacOLsfR+9HNvRXaWSitXNFa7i2G0iN/pnXb\na796mUMVMwJPkV6Si6608566mvqkSnvzulAaC/eev1KIyH5oF22yjyWRIM+K9ZNx\n7Cosnxgmt6e/8AazGBxA7gXxV6DQtOvL6k4AottUro2hMXLUZRS3x4GjtJDUjpLj\nUIHpK5Tz66D8dGN+Kv/f/Y7bAWMHUQqrPHkAcQIDAQABAoIBAEEcqeJfwqKBLE/n\n9m0SzRFuM978VmjvKiMM3qlND2Cm5zGCSCa+HdtgedWXfGAVVR6bKIw8oyUtmC7T\n5ugU1XJgdt58KrMXhn9R1ifl1mvNuC9WgYYShECKsogxaN86FgJf1FdZ51v5Ruq/\n9fb7mpTBem42hA/+5+hj1PnHvAXwI9/erX8nZIixtj9PVJOzUW/izlJVm9DoT2vM\nJZAt/HXZqovvsSet5tRfTPTuFH+NTXnfpHbDGPDqQrC+fqTaZCFJXU0lgWemBdM2\nHIafstxFhY5cbgYKl6nW8SQNQQUG7ifJ5ttz7jNqZ3X9hk2yIvK+0Dd1NKTlJoAS\n5V8FL00CgYEA96jBRG4I2P0rbQl7Elf5A4xS9ruFgQtS6//9g5ezLmxtiVQhryl4\n4PKKWY1nRPhQBQaQdp6H9w8rU5ccyAFjW4hDfD8jwTCE1On1dSfBWcrBir4LL/Dm\nWbOgrh2jotvAmInkl6GohwRZIF77kRQXc+Zv2Xle2o+JMv4keBmuk+sCgYEA63B9\nyoV0qhuTnrFNW99rQTQ8WnfUYdmau/4W2CSkNVgZ04j5xKe2FzBkQHnvCDX5THkW\nYVsq0J/F3BBApKvKwACVdri19odJRi2JgbJarMZb+xro8kqAZ3KvXkXTYpxkBk7S\nhkHBrj6sXe+I3usNN3iH80z6ZTsg2dBU7cp4khMCgYEA0amCBKaKwviBnQubr0ne\nvAw96DeUrEyj5LuRKahxvul4Sfx5j8qyVO3ABlRZiuAVDkwiXOmU/alP6rJRYVkb\nfk/7oeHqKREkQwPWE1qWq6ek9goxemKdAG+7pevdrnAPupNyfJQVEkiyE1+V5Zp2\nyF3bbub7UFiXtB3HTg2f6AUCgYEAt9DQ9TAywKjdHRXyfts1IuhEgqFx2J+LNmEP\nttsMtXU+XLBhyQ7jlME8VDaez/tL00/qkEIccFt9n+20epyBpFwQVWuq7Xn8VGUz\nKWZ1ctU/dRIycxCFpb6dem3rtt7BHUenCBkIvSDDdGeSpfBAFmHtSqB8ElMSt9v2\notzkO68CgYBhIDz4rTMuOxmt9yily7rcd9J7RrbC7hPHMjM5EwPyOmawAYjTRM8X\nrxe1w4MtKrXxn11EncMJuH0hLQ12MwmrTui7gllTi8IPkfe+e7yhgHzzB5Mnhax0\n92jL5rYiTenvy/wIjmF3TDHwyX6dB6QuozltdYBE2rv/oXOrE19qCQ==\n-----END RSA PRIVATE KEY-----',
        publicCert:
         '-----BEGIN CERTIFICATE-----\nMIIDrDCCApQCCQCLlKISnBv1OTANBgkqhkiG9w0BAQsFADCBlzELMAkGA1UEBhMC\nY2wxEzARBgNVBAgMClNvbWUtU3RhdGUxETAPBgNVBAcMCHNhbnRpYWdvMSEwHwYD\nVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQxFTATBgNVBAMMDDU5NzA0NDQ0\nNDQwNTEmMCQGCSqGSIb3DQEJARYXYW1hbGRvbmFkb0B0cmFuc2JhbmsuY2wwHhcN\nMTgwOTA0MTQxNDE0WhcNMjIwMzI3MTQxNDE0WjCBlzELMAkGA1UEBhMCY2wxEzAR\nBgNVBAgMClNvbWUtU3RhdGUxETAPBgNVBAcMCHNhbnRpYWdvMSEwHwYDVQQKDBhJ\nbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQxFTATBgNVBAMMDDU5NzA0NDQ0NDQwNTEm\nMCQGCSqGSIb3DQEJARYXYW1hbGRvbmFkb0B0cmFuc2JhbmsuY2wwggEiMA0GCSqG\nSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDjxLzvsZS2OViuohAOVkAyqDmR82utmUJl\nyQLUsbMJ9w+7subNrZzYXVDvMoQupVOjXC5lRLWKeFia2Dg97EMpqT+6vIBFHe7L\naSqrfIbchA0h1BhGkBSXxK83Im9RW0DQ3qfCNqqxO/URpw4ux9H70c29FdpZKK1c\n0VruLYbSI3+mddtrv3qZQxUzAk+RXpKLrrTznrqa+qRKe/O6UBoL956/UojIfmgX\nbbKPJZEgz4r1k3HsKiyfGCa3p7/wBrMYHEDuBfFXoNC068vqTgCi21SujaExctRl\nFLfHgaO0kNSOkuNQgekrlPProPx0Y34q/9/9jtsBYwdRCqs8eQBxAgMBAAEwDQYJ\nKoZIhvcNAQELBQADggEBAGQWdgUHhWXnGIiqE/0b1N2YPr2l1CTu86edj/3ySp1A\n7yIeWOiI1NUhMVXTt/uGw4C1WC4Ir3nhB1E0yrc65VF0GboE8m9ilj98NbkQKz0/\ndr3/TFb9Fc37WIMFoKsG2tnEXhLZxaahglEDdBcoL+I78K+JFtL92N7+Sns5zAmy\nDDKf/7bKvTBF5vXQzgYWkrGFweppVU1xfgCn5KFdqQSJZzvcu1xuCRSngLbcpBEW\nJlzTNzZ7K+siy5V9cKQtUW3h/KyMeP9KCE0YUnXvtiGr2yeqUviUAqDiSzcCmQDR\nXE4/CA2Yzlv/+n9JVsvFBTAyIvYfG3mqr8KdkL238sc=\n-----END CERTIFICATE-----',
        commerceCode: 597044444405,
        commerceEmail: '',
        service: 'normal',
        environment: 'integration',
        wsdlUrl:
         'https://webpay3gint.transbank.cl/WSWebpayTransaction/cxf/WSWebpayService?wsdl' }
    }
  },
  infoSecret: "6t1FntfHjA1igPTyQYfOYKXCp53QIb59"
};
