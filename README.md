# serverless-next-scripts

solve error on cli serverless deploy --package with next

Provide all serverless variable in next.config at runtime

Install:
```
nvm use

yarn install
```

In serverless.yml:

example:

```yaml
plugin:
    - serverless-next-scripts
custom:
    nextScripts:
        local: next -p 3001
        build: next build
```
