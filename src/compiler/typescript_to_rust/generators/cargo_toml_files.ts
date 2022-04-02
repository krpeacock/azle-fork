import { Toml } from '../../../types';

export function generateWorkspaceCargoToml(rootPath: string): Toml {
    return `
        # This code is automatically generated by Azle

        [workspace]
        members = [
            "${rootPath}"
        ]

        [profile.release]
        lto = true
        opt-level = 'z'
    `;
}

export function generateLibCargoToml(canisterName: string): Toml {
    return `
        # This code is automatically generated by Azle

        [package]
        name = "${canisterName}"
        version = "0.0.0"
        edition = "2018"

        [lib]
        crate-type = ["cdylib"]

        [dependencies]
        ic-cdk = "0.3.2"
        ic-cdk-macros = "0.3.2"
        # boa_engine = { git = "https://github.com/boa-dev/boa", rev = "e2630faf82a27e958d0ca6c9b1c81554bcc07ff3" }
        boa_engine = { git = "https://github.com/demergent-labs/boa", branch = "into-and-from-js-value" }
        getrandom = { version = "0.2.3", features = ["custom"] }
    `;
}