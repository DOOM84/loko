module.exports = {
    apps: [
        {
            name: 'loko',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            env: {
                NODE_PORT:"3050",
                //NODE_ENV:"development"
            }
        }
    ]
}